import pandas as pd
import numpy as np
import joblib
from elasticsearch import Elasticsearch
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler
import re
import os

es_host = os.getenv("ELASTICSEARCH_HOST", "elasticsearch")
es = Elasticsearch([f"http://{es_host}:9200"])

def extract_ingredients(source):
    """
    재료(ingredients)와 특별 재료(special) 포함하여 추출하는 함수
    """
    ingredients = []

    # 일반 재료 추출
    for ingredient in source.get('ingredients', []):
        if 'ingredient' in ingredient:
            ingredients.append(ingredient['ingredient'])

    # special 필드 추출
    for special in source.get('special', []):
        if isinstance(special, str):
            # 숫자, 단위 제거 후 재료명만 추출
            cleaned_special = re.sub(r'[\d.]+[a-zA-Z]*', '', special).strip()
            if cleaned_special:
                ingredients.append(cleaned_special)

    return ingredients


def fetch_data_from_es(index_name, size=1000):
    """ Elasticsearch에서 레시피 데이터를 가져오는 함수 """
    query = {"query": {"match_all": {}}, "size": size}
    response = es.search(index=index_name, body=query)

    data = []
    for hit in response['hits']['hits']:
        source = hit['_source']
        recipe_id = hit['_id']  # Elasticsearch 문서의 _id 사용
        ingredients = extract_ingredients(source)

        # 공통 필드
        recipe_data = {
            'id': recipe_id,
            'ingredients': ingredients
        }

        # 인덱스별 필드 추가
        if index_name == 'recipe_food':
            recipe_data['major'] = source.get('RCP_WAY2', '')
            recipe_data['minor'] = source.get('RCP_PAT2', '')

        elif index_name == 'recipe_cocktail':
            # abv를 따로 분리하고, major, minor를 각각 category, glass로 변경
            recipe_data['abv'] = str(source.get('abv', ''))  # abv를 따로 저장
            recipe_data['major'] = source.get('category', '')  # category를 major로 저장
            recipe_data['minor'] = source.get('glass', '')  # glass를 minor로 저장

        data.append(recipe_data)

    return pd.DataFrame(data)


def train_tfidf_model(df, type, ingredient_path='_ingredient.pkl', major_path='_major.pkl',
                      minor_path='_minor.pkl', abv_path='_abv.pkl'):
    """ 재료(ingredients), 조리법(major), 음식 종류(minor)를 각각 벡터화하고 저장, abv는 칵테일에만 처리 """

    # 1️⃣ 재료 (ingredients) 벡터화
    df['ingredients_str'] = df['ingredients'].apply(lambda x: ' '.join(x))
    ingredient_vectorizer = TfidfVectorizer(max_features=1000)
    ingredient_vectorizer.fit(df['ingredients_str'])
    joblib.dump(ingredient_vectorizer, type + ingredient_path)

    # 2️⃣ 조리법 (major) 벡터화
    df['major_str'] = df['major'].fillna('')
    major_vectorizer = TfidfVectorizer(max_features=100)
    major_vectorizer.fit(df['major_str'])
    joblib.dump(major_vectorizer, type + major_path)

    # 3️⃣ 음식 종류 (minor) 벡터화
    df['minor_str'] = df['minor'].fillna('')
    minor_vectorizer = TfidfVectorizer(max_features=100)
    minor_vectorizer.fit(df['minor_str'])
    joblib.dump(minor_vectorizer, type + minor_path)

    # 4️⃣ abv 처리 (칼럼이 'cocktail'일 때만 처리)
    if type == "cocktail":
        abv_data = df['abv'].apply(lambda x: float(x) if x else 0).values.reshape(-1, 1)  # 수치형으로 변환
        abv_scaler = StandardScaler()  # 정규화
        abv_scaler.fit(abv_data)
        joblib.dump(abv_scaler, type + abv_path)


def load_tfidf_models(type, ingredient_path='_ingredient.pkl', major_path='_major.pkl',
                      minor_path='_minor.pkl', abv_path='_abv.pkl'):
    """ 저장된 TF-IDF 및 정규화 모델을 불러오는 함수 """

    ingredient_vectorizer = joblib.load(type + ingredient_path)
    major_vectorizer = joblib.load(type + major_path)
    minor_vectorizer = joblib.load(type + minor_path)

    # 'cocktail' 타입일 때만 abv 모델을 불러옴
    if type == "cocktail":

        abv_scaler = joblib.load(type + abv_path)
        return ingredient_vectorizer, major_vectorizer, minor_vectorizer, abv_scaler
    else:
        return ingredient_vectorizer, major_vectorizer, minor_vectorizer, None


def recommend_recipe(user_likes, df, ingredient_vectorizer, major_vectorizer, minor_vectorizer, abv_scaler=None, top_n=3, weight_ingredient=0.6, weight_major=0.3, weight_minor=0.1, weight_abv=0.5):
    """
    사용자 좋아요 기반으로 레시피 추천하는 함수
    - 재료(ingredients), 조리법(major), 음식 종류(minor), abv 유사도를 따로 계산
    - 각 요소에 가중치를 적용하여 최종 유사도를 계산
    """
    recommendations = []

    for user_like_id in user_likes:
        liked_recipe_row = df[df['id'] == user_like_id]
        if liked_recipe_row.empty:
            continue  # ID가 없으면 건너뛰기

        # 사용자가 좋아한 레시피 벡터화
        liked_ingredient_vec = ingredient_vectorizer.transform(liked_recipe_row['ingredients_str'])
        liked_major_vec = major_vectorizer.transform(liked_recipe_row['major_str'])
        liked_minor_vec = minor_vectorizer.transform(liked_recipe_row['minor_str'])
        liked_abv = liked_recipe_row['abv'].values.reshape(-1, 1) if 'abv' in liked_recipe_row.columns else None

        if abv_scaler is not None and liked_abv is not None:
            liked_abv = abv_scaler.transform(liked_abv)

        for _, row in df.iterrows():
            if row['id'] == user_like_id:
                continue  # 자기 자신 제외

            # 비교 대상 레시피 벡터화
            ingredient_vec = ingredient_vectorizer.transform([row['ingredients_str']])
            major_vec = major_vectorizer.transform([row['major_str']])
            minor_vec = minor_vectorizer.transform([row['minor_str']])
            abv = row['abv'] if 'abv' in row else None
            abv = np.array(abv).reshape(-1, 1) if abv is not None else None

            if abv_scaler is not None and abv is not None:
                abv = abv_scaler.transform(abv)

            # 유사도 계산 (코사인 유사도 사용)
            ingredient_similarity = cosine_similarity(liked_ingredient_vec, ingredient_vec)[0][0]
            major_similarity = cosine_similarity(liked_major_vec, major_vec)[0][0]
            minor_similarity = cosine_similarity(liked_minor_vec, minor_vec)[0][0]

            # abv 유사도 계산 (스칼라 값 차이로 계산)
            abv_similarity = 1 - abs(liked_abv - abv) if abv is not None else 0

            # abv_similarity가 배열이 아닌지 확인하고, 단일 값으로 변환
            if isinstance(abv_similarity, np.ndarray):
                abv_similarity = abv_similarity[0][0]

            # 최종 유사도 = (재료 * 0.6) + (조리법 * 0.3) + (음식 종류 * 0.1) + (abv * 0.5)
            total_similarity = (
                ingredient_similarity * weight_ingredient +
                major_similarity * weight_major +
                minor_similarity * weight_minor +
                abv_similarity * weight_abv
            )

            # total_similarity가 배열일 경우 첫 번째 값을 추출
            total_similarity_score = round(float(total_similarity) * 100)  # 첫 번째 값만 추출
            # 첫 번째 값만 추출

            recommendations.append((row['id'], total_similarity_score))

    # 유사도가 높은 순으로 정렬
    recommendations = sorted(recommendations, key=lambda x: x[1], reverse=True)
    return recommendations[:top_n]  # 상위 N개 추천

# 현재 파일에서만 실행되도록 조건 추가
if __name__ == "__main__":
    dataframe = fetch_data_from_es("recipe_cocktail")
    train_tfidf_model(dataframe, "cocktail")
    ing_vec, major_vec, minor_vec, abv_sca = load_tfidf_models("cocktail")
    recommends = recommend_recipe(['1DonapUBcJinAtT_ZsG8'], dataframe, ing_vec, major_vec, minor_vec, abv_sca)
    print(recommends)
