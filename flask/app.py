from flask import Flask, request, jsonify
from elasticsearch import Elasticsearch
import json
import os


app = Flask(__name__)
es_host = os.getenv("ELASTICSEARCH_HOST", "localhost")
es = Elasticsearch([f"http://{es_host}:9200"])


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

def get_index_and_mapping(file_type: str):
    """
    주어진 file_type에 따라 인덱스 이름과 매핑 파일명을 반환하는 함수
    """
    index_mapping = {
        "cocktail": ("recipe_cocktail", "cocktail_mapping.json"),
        "food": ("recipe_food", "food_mapping.json"),
        "cocktail_ingredient": ("cocktail_ingredient", "cocktail_ingredient_mapping.json"),
        "food_ingredient": ("food_ingredient", "food_ingredient_mapping.json"),
        "feed": ("feed", "feed_mapping.json"),
    }

    return index_mapping.get(file_type, (None, None))


# 글 하나 업로드
@app.route("/upload/one", methods=["POST"])
def upload_one():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400

        file_type = request.form.get("type")
        if not file_type:
            return jsonify({"error": "Type is required"}), 400

        index_name, mapping_file = get_index_and_mapping(file_type)

        # 인덱스가 없으면 매핑을 적용하여 생성
        if not es.indices.exists(index=index_name):
            create_index_if_not_exists(index_name, mapping_file)

        # 데이터 삽입
        es.index(index=index_name, body=data)
        return jsonify({"message": "Data uploaded successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# JSON 파일 업로드 (여러 개의 데이터 한 번에)
@app.route("/upload/json", methods=["POST"])
def upload_json():
    try:
        file = request.files.get("file")
        if not file:
            return jsonify({"error": "No file provided"}), 400

        file_type = request.form.get("type")
        if not file_type:
            return jsonify({"error": "Type is required"}), 400

        # 폼의 타입에 맞춰 인덱스 이름 설정
        index_name, mapping_file = get_index_and_mapping(file_type)

        # 인덱스가 없으면 매핑을 적용하여 생성
        if not es.indices.exists(index=index_name):
            create_index_if_not_exists(index_name, mapping_file)

        data = json.load(file)
        for item in data:
            es.index(index=index_name, body=item)

        return jsonify({"message": "Data uploaded successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 재료별 검색 (레시피만 검색되도록 수정)
@app.route("/search", methods=["GET"])
def search():
    try:
        q = request.args.get("q", "")
        type_filter = request.args.get("type", "")
        category = request.args.get("category", "")
        cooking_method = request.args.get("cookingMethod", "")
        page = request.args.get("page", 1, type=int)
        size = request.args.get("size", 20, type=int)

        index_name, _ = get_index_and_mapping(type_filter)
        if not index_name:
            return jsonify({"error": "Invalid type filter"}), 400

        # type_filter에 따라 필드명을 설정 (음식과 칵테일을 구분)
        if type_filter == "food":
            category_field = "RCP_PAT2"   # 음식은 ES 매핑에서 RCP_PAT2로 저장됨
            cooking_field = "RCP_WAY2"    # 음식의 조리방법 필드
            multi_match_fields = ["name", "ingredients.ingredient", "RCP_PAT2"]
        else:
            category_field = "category"   # 칵테일은 기존 필드 사용
            cooking_field = "cookingMethod"  # 칵테일은 조리방법 필터가 없을 수 있으므로 기본값
            multi_match_fields = ["name", "ingredients.ingredient", "category"]

        # 조건에 따라 쿼리를 구성합니다.
        if q and category and cooking_method:
            query = {
                "bool": {
                    "must": [
                        {
                            "multi_match": {
                                "query": q,
                                "fields": multi_match_fields
                            }
                        },
                        {
                            "term": {
                                category_field: {"value": category}
                            }
                        },
                        {
                            "term": {
                                cooking_field: {"value": cooking_method}
                            }
                        }
                    ]
                }
            }
        elif q and category:
            query = {
                "bool": {
                    "must": [
                        {
                            "multi_match": {
                                "query": q,
                                "fields": multi_match_fields
                            }
                        },
                        {
                            "term": {
                                category_field: {"value": category}
                            }
                        }
                    ]
                }
            }
        elif q and cooking_method:
            query = {
                "bool": {
                    "must": [
                        {
                            "multi_match": {
                                "query": q,
                                "fields": multi_match_fields
                            }
                        },
                        {
                            "term": {
                                cooking_field: {"value": cooking_method}
                            }
                        }
                    ]
                }
            }
        elif category and cooking_method:
            query = {
                "bool": {
                    "must": [
                        {
                            "term": {
                                category_field: {"value": category}
                            }
                        },
                        {
                            "term": {
                                cooking_field: {"value": cooking_method}
                            }
                        }
                    ]
                }
            }
        elif q:
            query = {
                "multi_match": {
                    "query": q,
                    "fields": multi_match_fields
                }
            }
        elif category:
            query = {
                "term": {
                    category_field: {"value": category}
                }
            }
        elif cooking_method:
            query = {
                "term": {
                    cooking_field: {"value": cooking_method}
                }
            }
        else:
            query = {"match_all": {}}

        # _source 필드 설정 (음식이면 조리방법 필드를 포함)
        if type_filter == "food":
            source_fields = ["name", "RCP_PAT2", "RCP_WAY2", "like", "abv"]
        else:
            source_fields = ["name", "category", "like", "abv"]

        body = {
            "from": (page - 1) * size,
            "size": size,
            "_source": source_fields,
            "query": query
        }

        res = es.search(index=index_name, body=body)

        results = [
            {**hit["_source"], "id": hit["_id"]}
            for hit in res["hits"]["hits"]
        ]
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/search/alcohol", methods=["GET"])
def search_alcohol():
    try:
        min_abv = request.args.get("min_abv", 0, type=int)
        max_abv = request.args.get("max_abv", 100, type=int)
        page = request.args.get("page", 1, type=int)
        size = request.args.get("size", 20, type=int)

        res = es.search(index="recipe_cocktail", body={
            "from": (page - 1) * size,
            "size": size,
            "_source": ["name", "category", "like"],
            "query": {
                "range": {
                    "abv": {
                        "gte": min_abv,
                        "lte": max_abv
                    }
                }
            }
        })

        results = [
            {**hit["_source"], "id": hit["_id"]}
            for hit in res["hits"]["hits"]
        ]
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route("/detail/<doc_id>", methods=["GET"])
def detail(doc_id):
    type_filter = request.args.get("type", "")
    index_name, _ = get_index_and_mapping(type_filter)
    if not index_name:
        return jsonify({"error": "Invalid type filter"}), 400

    try:
        # Elasticsearch 에서 해당 ID 문서 검색
        response = es.get(index=index_name, id=id)
        return jsonify(response["_source"])  # 문서 데이터 반환
    except Exception as e:
        return jsonify({"error": str(e)}), 404  # 문서를 찾을 수 없을 경우 404 응답


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
