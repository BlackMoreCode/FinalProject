from flask import Flask, request, jsonify
from elasticsearch import Elasticsearch
import json

app = Flask(__name__)
es = Elasticsearch(["http://localhost:9200"])


# JSON 파일에서 매핑을 로드하는 함수
def load_mapping(file_path):
    with open(file_path, "r") as f:
        return json.load(f)


# 인덱스가 없다면 매핑을 설정하고 인덱스를 생성하는 함수
def create_index_if_not_exists(index_name, mapping_file=None):
    if not es.indices.exists(index=index_name):
        if mapping_file:
            mapping = load_mapping(mapping_file)
            es.indices.create(index=index_name, body=mapping)
        else:
            es.indices.create(index=index_name, body={})
        return jsonify({"message": f"Index {index_name} created successfully"}), 200
    else:
        return jsonify({"message": f"Index {index_name} already exists"}), 400


# 글 하나 업로드
@app.route("/upload/one", methods=["POST"])
def upload_one():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    file_type = request.form.get("type")
    if not file_type:
        return jsonify({"error": "Type is required"}), 400

    # 폼의 타입에 맞춰 인덱스 이름 설정
    if file_type == "cocktail":
        index_name = "recipe_cocktail"
        mapping_file = "cocktail_mapping.json"
    elif file_type == "food":
        index_name = "recipe_food"
        mapping_file = "food_mapping.json"
    elif file_type == "cocktail_ingredient":
        index_name = "cocktail_ingredient"
        mapping_file = "cocktail_ingredient_mapping.json"
    elif file_type == "food_ingredient":
        index_name = "food_ingredient"
        mapping_file = "food_ingredient_mapping.json"
    elif file_type == "feed":
        index_name = "feed"  # 인덱스를 'feed'로 설정
        mapping_file = "feed_mapping.json"  # feed에 해당하는 매핑 파일
    else:
        return jsonify({"error": "Invalid type provided"}), 400

    # 인덱스가 없으면 매핑을 적용하여 생성
    if not es.indices.exists(index=index_name):
        create_index_if_not_exists(index_name, mapping_file)

    # 데이터 삽입
    es.index(index=index_name, body=data)
    return jsonify({"message": "Data uploaded successfully"}), 200


# JSON 파일 업로드 (여러 개의 데이터 한 번에)
@app.route("/upload/json", methods=["POST"])
def upload_json():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file provided"}), 400

    file_type = request.form.get("type")
    if not file_type:
        return jsonify({"error": "Type is required"}), 400

    # 폼의 타입에 맞춰 인덱스 이름 설정
    if file_type == "cocktail":
        index_name = "recipe_cocktail"
        mapping_file = "cocktail_mapping.json"
    elif file_type == "food":
        index_name = "recipe_food"
        mapping_file = "food_mapping.json"
    elif file_type == "cocktail_ingredient":
        index_name = "cocktail_ingredient"
        mapping_file = "cocktail_ingredient_mapping.json"
    elif file_type == "food_ingredient":
        index_name = "food_ingredient"
        mapping_file = "food_ingredient_mapping.json"
    elif file_type == "feed":
        index_name = "feed"  # 인덱스를 'feed'로 설정
        mapping_file = "feed_mapping.json"  # feed에 해당하는 매핑 파일
    else:
        return jsonify({"error": "Invalid type provided"}), 400

    # 인덱스가 없으면 매핑을 적용하여 생성
    if not es.indices.exists(index=index_name):
        create_index_if_not_exists(index_name, mapping_file)

    data = json.load(file)
    for item in data:
        es.index(index=index_name, body=item)

    return jsonify({"message": "Data uploaded successfully"}), 200


# 재료별 검색 (레시피만 검색되도록 수정)
@app.route("/search", methods=["GET"])
def search():
    query = request.args.get("q", "")
    type_filter = request.args.get("type", "")
    page = request.args.get("page", 1, type=int)
    size = request.args.get("size", 10, type=int)

    if not query:
        return jsonify({"error": "Query is required"}), 400

    if not type_filter:
        return jsonify({"error": "'type' filter is required, use 'cocktail' or 'food'"}), 400

    index_name = f"recipe_{type_filter}"

    res = es.search(index=index_name, body={
        "from": (page - 1) * size,
        "size": size,
        "query": {
            "multi_match": {
                "query": query,
                "fields": ["name", "ingredients"]
            }
        }
    })

    return jsonify(res["hits"]["hits"])


@app.route("/search/ingredient", methods=["GET"])
def search_ingredient():
    ingredient = request.args.get("ingredient", "")
    type_filter = request.args.get("type", "")
    page = request.args.get("page", 1, type=int)
    size = request.args.get("size", 10, type=int)

    if not ingredient:
        return jsonify({"error": "Ingredient is required"}), 400

    if not type_filter:
        return jsonify({"error": "'type' filter is required, use 'cocktail' or 'food'"}), 400

    index_name = f"{type_filter}_ingredient"

    res = es.search(index=index_name, body={
        "from": (page - 1) * size,
        "size": size,
        "query": {
            "match": {"ingredients": ingredient}
        }
    })

    return jsonify(res["hits"]["hits"])


@app.route("/search/recipe", methods=["GET"])
def search_recipe():
    type_filter = request.args.get("type", "")
    query = request.args.get("query", "")
    page = request.args.get("page", 1, type=int)
    size = request.args.get("size", 10, type=int)

    if not type_filter:
        return jsonify({"error": "'type' filter is required, use 'cocktail' or 'food'"}), 400

    index_name = f"recipe_{type_filter}"

    es_query = {
        "from": (page - 1) * size,
        "size": size,
        "query": {"match_all": {}}
    }

    if query:
        es_query["query"] = {
            "multi_match": {
                "query": query,
                "fields": ["name", "ingredients"]
            }
        }

    res_recipe = es.search(index=index_name, body=es_query)
    recipes = [hit["_source"] for hit in res_recipe["hits"]["hits"]]

    return jsonify(recipes)


@app.route("/search/alcohol", methods=["GET"])
def search_alcohol():
    min_abv = request.args.get("min_abv", 0, type=float)
    max_abv = request.args.get("max_abv", 100, type=float)
    page = request.args.get("page", 1, type=int)
    size = request.args.get("size", 10, type=int)

    res = es.search(index="recipe_cocktail", body={
        "from": (page - 1) * size,
        "size": size,
        "query": {
            "range": {
                "abv": {
                    "gte": min_abv,
                    "lte": max_abv
                }
            }
        }
    })

    return jsonify(res["hits"]["hits"])


if __name__ == "__main__":
    app.run(debug=True)
