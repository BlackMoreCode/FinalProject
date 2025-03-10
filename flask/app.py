from flask import Flask, request, jsonify
from elasticsearch import Elasticsearch
import json
import os
from datetime import datetime, timezone
from machine_learning.forest import fetch_data_from_es, load_tfidf_models, recommend_recipe

app = Flask(__name__)
es_host = os.getenv("ELASTICSEARCH_HOST", "elasticsearch")
es = Elasticsearch([f"http://{es_host}:9200"])

# ================================================================
# Utility Functions (공통 ES 인덱스 및 매핑 관리)
# ================================================================

def load_mapping(file_path):
    """
    JSON 파일에서 매핑을 로드하는 함수
    KR: 주어진 파일 경로에서 ElasticSearch 매핑 정보를 로드합니다.
    """
    with open(file_path, "r") as f:
        return json.load(f)

def create_index_if_not_exists(index_name, mapping_file=None):
    """
    인덱스가 없으면 매핑을 설정하고 인덱스를 생성하는 함수
    KR: 지정된 인덱스가 존재하지 않으면, mapping_file이 제공되었을 경우 해당 파일에서 매핑 정보를 로드하여
        인덱스를 생성합니다. 매핑 파일이 없거나 존재하지 않으면 빈 매핑({})으로 인덱스를 생성합니다.
    """
    if not es.indices.exists(index=index_name):
        if mapping_file and os.path.exists(mapping_file):
            try:
                mapping = load_mapping(mapping_file)
                es.indices.create(index=index_name, body=mapping)
                app.logger.info("인덱스 '{}'가 매핑 파일 '{}'을 사용하여 생성되었습니다.".format(index_name, mapping_file))
            except Exception as e:
                app.logger.error("매핑 파일 '{}'을 사용하여 인덱스를 생성하는 중 오류 발생: {}. 빈 매핑으로 생성합니다.".format(mapping_file, str(e)))
                es.indices.create(index=index_name, body={})
                app.logger.info("인덱스 '{}'가 빈 매핑으로 생성되었습니다.".format(index_name))
        else:
            # KR: 매핑 파일이 제공되지 않거나 존재하지 않으면 기본(empty) 매핑으로 인덱스 생성
            es.indices.create(index=index_name, body={})
            app.logger.info("인덱스 '{}'가 빈 매핑으로 생성되었습니다.".format(index_name))
        return jsonify({"message": f"Index {index_name} created successfully"}), 200
    else:
        return jsonify({"message": f"Index {index_name} already exists"}), 400

def get_index_and_mapping(file_type: str):
    """
    주어진 file_type에 따라 인덱스 이름과 매핑 파일명을 반환하는 함수
    KR: file_type이 'cocktail', 'food', 'forum_post', 'forum_category' 등일 때 각 ES 인덱스 이름과 매핑 파일을 반환합니다.
    """
    index_mapping = {
        "cocktail": ("recipe_cocktail", "cocktail_mapping.json"),
        "food": ("recipe_food", "food_mapping.json"),
        "cocktail_ingredient": ("cocktail_ingredient", "cocktail_ingredient_mapping.json"),
        "food_ingredient": ("food_ingredient", "food_ingredient_mapping.json"),
        "feed": ("feed", "feed_mapping.json"),
        "forum_post": ("forum_post", "forum_post_mapping.json"),
        "forum_category": ("forum_category", "forum_category_mapping.json")
    }
    return index_mapping.get(file_type, (None, None))


# ================================================================
# 기존 도메인(칵테일, 음식 등) 관련 엔드포인트 (변경 없이 그대로 유지)
# ================================================================

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

        index_name, mapping_file = get_index_and_mapping(file_type)

        if not es.indices.exists(index=index_name):
            create_index_if_not_exists(index_name, mapping_file)

        data = json.load(file.read().decode("utf-8"))
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

        if type_filter == "food":
            category_field = "RCP_PAT2"   # 음식은 ES 매핑에서 RCP_PAT2로 저장됨
            cooking_field = "RCP_WAY2"    # 음식의 조리방법 필드
            multi_match_fields = ["name", "ingredients.ingredient", "RCP_PAT2"]
        else:
            category_field = "category"   # 칵테일은 기존 필드 사용
            cooking_field = "cookingMethod"  # 칵테일은 조리방법 필터가 없을 수 있으므로 기본값
            multi_match_fields = ["name", "ingredients.ingredient", "category"]

        if q and category and cooking_method:
            query = {
                "bool": {
                    "must": [
                        {"multi_match": {"query": q, "fields": multi_match_fields}},
                        {"term": {category_field: {"value": category}}},
                        {"term": {cooking_field: {"value": cooking_method}}}
                    ]
                }
            }
        elif q and category:
            query = {
                "bool": {
                    "must": [
                        {"multi_match": {"query": q, "fields": multi_match_fields}},
                        {"term": {category_field: {"value": category}}}
                    ]
                }
            }
        elif q and cooking_method:
            query = {
                "bool": {
                    "must": [
                        {"multi_match": {"query": q, "fields": multi_match_fields}},
                        {"term": {cooking_field: {"value": cooking_method}}}
                    ]
                }
            }
        elif category and cooking_method:
            query = {
                "bool": {
                    "must": [
                        {"term": {category_field: {"value": category}}},
                        {"term": {cooking_field: {"value": cooking_method}}}
                    ]
                }
            }
        elif q:
            query = {"multi_match": {"query": q, "fields": multi_match_fields}}
        elif category:
            query = {"term": {category_field: {"value": category}}}
        elif cooking_method:
            query = {"term": {cooking_field: {"value": cooking_method}}}
        else:
            query = {"match_all": {}}

        if type_filter == "food":
            source_fields = ["name", "RCP_PAT2", "RCP_WAY2", "like", "abv", "ATT_FILE_NO_MAIN"]
        else:
            source_fields = ["name", "category", "like", "abv"]

        body = {
            "from": (page - 1) * size,
            "size": size,
            "_source": source_fields,
            "query": query
        }

        res = es.search(index=index_name, body=body)
        results = [{**hit["_source"], "id": hit["_id"]} for hit in res["hits"]["hits"]]
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 검색 알코올 (레시피용; 단 하나만 남김)
@app.route("/search/alcohol", methods=["GET"], endpoint="unique_search_alcohol")
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
                "range": {"abv": {"gte": min_abv, "lte": max_abv}}
            }
        })
        results = [{**hit["_source"], "id": hit["_id"]} for hit in res["hits"]["hits"]]
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)})

# 상세 조회 (레시피용)
@app.route("/detail/<doc_id>", methods=["GET"], endpoint="recipe_detail")
def detail(doc_id):
    type_filter = request.args.get("type", "")
    index_name, _ = get_index_and_mapping(type_filter)
    if not index_name:
        return jsonify({"error": "Invalid type filter"}), 400
    try:
        # ES 에서 해당 ID 문서 검색 (주의: 변수 이름 수정)
        response = es.get(index=index_name, id=doc_id)
        return jsonify(response["_source"])
    except Exception as e:
        return jsonify({"error": str(e)}), 404


# ================================================================
# Forum Endpoints (ElasticSearch-based) - 새 Forum 기능
# ================================================================

# Forum 게시글 생성
@app.route("/forum/post", methods=["POST"])
def create_forum_post():
    """
    새 포럼 게시글 생성
    KR: 클라이언트로부터 받은 게시글 데이터를 기반으로 ES의 'forum_post' 인덱스에 게시글 문서를 생성합니다.
    """
    try:
        data = request.json
        if not data:
            return jsonify({"error": "데이터가 제공되지 않았습니다."}), 400

        # 변경: 'forum' -> 'forum_post'
        index_name, mapping_file = get_index_and_mapping("forum_post")
        if not es.indices.exists(index=index_name):
            create_index_if_not_exists(index_name, mapping_file)

        data.setdefault("viewsCount", 0)
        data.setdefault("likesCount", 0)
        data.setdefault("likedBy", [])
        data.setdefault("reportCount", 0)
        data.setdefault("comments", [])
        now = datetime.now(timezone.utc).isoformat()
        data.setdefault("createdAt", now)
        data.setdefault("updatedAt", now)

        res = es.index(index=index_name, body=data)
        return jsonify({"message": "게시글이 생성되었습니다.", "id": res["_id"]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Forum 게시글 상세 조회
@app.route("/forum/post/<doc_id>", methods=["GET"], endpoint="forum_post_detail")
def get_forum_post(doc_id):
    """
    게시글 상세 조회 (Forum)
    KR: ES의 'forum_post' 인덱스에서 주어진 문서 ID의 게시글을 조회하여 반환합니다.
    """
    try:
        index_name, _ = get_index_and_mapping("forum_post")
        res = es.get(index=index_name, id=doc_id)
        return jsonify(res["_source"])
    except Exception as e:
        return jsonify({"error": str(e)}), 404

# Forum 게시글 제목 수정
@app.route("/forum/post/<doc_id>/title", methods=["PUT"])
def update_forum_post_title(doc_id):
    """
    게시글 제목 수정 (Forum Post)
    KR: 주어진 문서 ID의 게시글에서 제목(title)을 수정합니다.
        이 엔드포인트는 'forum_post' 인덱스를 사용합니다.
    """
    try:
        new_title = request.json.get("title")
        if not new_title:
            return jsonify({"error": "새 제목이 필요합니다."}), 400
        index_name, _ = get_index_and_mapping("forum_post")
        post = es.get(index=index_name, id=doc_id)["_source"]
        post["title"] = new_title
        post["updatedAt"] = datetime.now(timezone.utc).isoformat()
        post["editedByTitle"] = request.json.get("editedBy", "USER")
        es.index(index=index_name, id=doc_id, body=post)
        return jsonify({"message": "제목이 수정되었습니다.", "title": new_title}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Forum 게시글 내용 수정 (TipTap JSON 전용)
@app.route("/forum/post/<doc_id>/content", methods=["PUT"])
def update_forum_post_content(doc_id):
    """
    게시글 내용 수정 (Forum - TipTap JSON)
    KR: 게시글의 contentJSON 필드를 업데이트합니다.
    """
    try:
        contentJSON = request.json.get("contentJSON")
        if not contentJSON:
            return jsonify({"error": "contentJSON 필드는 필수입니다."}), 400
        index_name, _ = get_index_and_mapping("forum_post")
        post = es.get(index=index_name, id=doc_id)["_source"]
        post["contentJSON"] = contentJSON
        post["updatedAt"] = datetime.now(timezone.utc).isoformat()
        post["editedByContent"] = request.json.get("editedBy", "USER")
        if request.json.get("isAdmin", False):
            post["locked"] = True
        es.index(index=index_name, id=doc_id, body=post)
        return jsonify({"message": "내용이 수정되었습니다.", "contentJSON": contentJSON}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Forum 게시글 좋아요 토글
@app.route("/forum/post/<doc_id>/like", methods=["POST"])
def toggle_forum_post_like(doc_id):
    """
    게시글 좋아요 토글 (Forum)
    KR: 특정 게시글에 대해 좋아요를 추가 또는 취소하여 likedBy 배열과 likesCount를 업데이트합니다.
    """
    try:
        req_data = request.json
        if not req_data or "memberId" not in req_data:
            return jsonify({"error": "memberId가 필요합니다."}), 400
        member_id = req_data["memberId"]
        index_name, _ = get_index_and_mapping("forum_post")
        post = es.get(index=index_name, id=doc_id)["_source"]
        liked_by = post.get("likedBy", [])
        if member_id in liked_by:
            liked_by.remove(member_id)
            post["likesCount"] = max(post.get("likesCount", 0) - 1, 0)
            action = "취소"
        else:
            liked_by.append(member_id)
            post["likesCount"] = post.get("likesCount", 0) + 1
            action = "추가"
        post["likedBy"] = liked_by
        post["updatedAt"] = datetime.now(timezone.utc).isoformat()
        es.index(index=index_name, id=doc_id, body=post)
        return jsonify({"message": f"좋아요가 {action}되었습니다.", "likesCount": post["likesCount"]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Forum 게시글 신고 처리
@app.route("/forum/post/<doc_id>/report", methods=["POST"])
def report_forum_post(doc_id):
    """
    게시글 신고 처리 (Forum)
    KR: 신고자 ID와 신고 사유를 받아 해당 게시글의 reportCount를 증가시키고, 신고 임계값 이상이면 게시글을 숨김 처리합니다.
    """
    try:
        req_data = request.json
        reporter_id = req_data.get("reporterId")
        reason = req_data.get("reason")
        if not reporter_id or not reason:
            return jsonify({"error": "신고자 ID와 신고 사유는 필수입니다."}), 400
        REPORT_THRESHOLD = 10
        index_name, _ = get_index_and_mapping("forum_post")
        post = es.get(index=index_name, id=doc_id)["_source"]
        if post["member"]["memberId"] == reporter_id:
            return jsonify({"error": "자신의 게시글은 신고할 수 없습니다."}), 400
        post["reportCount"] = post.get("reportCount", 0) + 1
        if post["reportCount"] >= REPORT_THRESHOLD:
            post["hidden"] = True
        post["updatedAt"] = datetime.now(timezone.utc).isoformat()
        es.index(index=index_name, id=doc_id, body=post)
        return jsonify({"message": "게시글이 신고되었습니다.", "reportCount": post["reportCount"]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Forum 게시글 삭제 (논리 삭제)
@app.route("/forum/post/<doc_id>", methods=["DELETE"], endpoint="delete_forum_post")
def delete_forum_post(doc_id):
    """
    게시글 삭제 (Forum, 논리 삭제)
    KR: 게시글을 실제 삭제하지 않고, 삭제 상태로 표시합니다.
        삭제 이력은 'forum_post_history' 인덱스에 기록됩니다.
    """
    try:
        index_name, _ = get_index_and_mapping("forum_post")
        post = es.get(index=index_name, id=doc_id)["_source"]

        history = {
            "postId": post.get("id", doc_id),
            "title": post.get("title"),
            "content": post.get("content"),
            "authorName": post.get("member", {}).get("nickName", "Unknown"),
            "deletedAt": datetime.now(timezone.utc).isoformat(),
            "fileUrls": post.get("fileUrls", [])
        }
        es.index(index="forum_post_history", body=history)

        post["removedBy"] = request.args.get("removedBy", "USER")
        post["hidden"] = True
        post["title"] = "[Deleted]"
        post["content"] = "This post has been deleted."
        post["updatedAt"] = datetime.now(timezone.utc).isoformat()
        es.index(index=index_name, id=doc_id, body=post)
        return jsonify({"message": "게시글이 삭제 처리되었습니다."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Forum 댓글 생성
@app.route("/forum/comment", methods=["POST"])
def create_forum_comment():
    """
    댓글 생성 (Forum)
    KR: 클라이언트로부터 받은 댓글 데이터를 기반으로, 해당 게시글의 'comments' 배열에 새 댓글을 추가합니다.
    """
    try:
        data = request.json
        for field in ["postId", "memberId", "content"]:
            if field not in data:
                return jsonify({"error": f"{field} 필드는 필수입니다."}), 400

        index_name, _ = get_index_and_mapping("forum_post")
        post_id = str(data["postId"])
        post = es.get(index=index_name, id=post_id)["_source"]

        new_comment = {
            "id": None,
            "content": data["content"],
            "contentJSON": data.get("contentJSON", ""),
            "member": {
                "memberId": data["memberId"],
                "nickName": data.get("nickName", "")
            },
            "likesCount": 0,
            "hidden": False,
            "removedBy": None,
            "fileUrl": data.get("fileUrl", ""),
            "reportCount": 0,
            "parentCommentId": data.get("parentCommentId"),
            "opAuthorName": data.get("opAuthorName", ""),
            "opContent": data.get("opContent", ""),
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "updatedAt": datetime.now(timezone.utc).isoformat(),
            "editedBy": None,
            "locked": False
        }
        comments = post.get("comments", [])
        new_comment["id"] = len(comments) + 1
        comments.append(new_comment)
        post["comments"] = comments
        post["updatedAt"] = datetime.now(timezone.utc).isoformat()
        es.index(index=index_name, id=post_id, body=post)
        return jsonify({"message": "댓글이 추가되었습니다.", "comment": new_comment}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Forum 댓글 조회
@app.route("/forum/comments", methods=["GET"])
def get_forum_comments():
    """
    댓글 조회 (Forum)
    KR: 쿼리 파라미터 'postId'에 해당하는 게시글 문서에서 'comments' 배열을 반환합니다.
    """
    try:
        post_id = request.args.get("postId")
        if not post_id:
            return jsonify({"error": "postId 파라미터가 필요합니다."}), 400
        index_name, _ = get_index_and_mapping("forum_post")
        post = es.get(index=index_name, id=str(post_id))["_source"]
        comments = post.get("comments", [])
        return jsonify(comments), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Forum 댓글 수정
@app.route("/forum/comment/<int:comment_id>", methods=["PUT"])
def update_forum_comment(comment_id):
    """
    댓글 수정 (Forum)
    KR: 특정 댓글의 contentJSON (TipTap JSON)을 업데이트합니다.
    """
    try:
        req_data = request.json
        new_contentJSON = req_data.get("contentJSON")
        if not new_contentJSON:
            return jsonify({"error": "contentJSON 필드는 필수입니다."}), 400

        post_id = req_data.get("postId")
        if not post_id:
            return jsonify({"error": "postId 필드가 필요합니다."}), 400

        index_name, _ = get_index_and_mapping("forum_post")
        post = es.get(index=index_name, id=str(post_id))["_source"]
        comments = post.get("comments", [])
        updated = False
        for comment in comments:
            if comment.get("id") == comment_id:
                comment["contentJSON"] = new_contentJSON
                comment["updatedAt"] = datetime.now(timezone.utc).isoformat()
                comment["editedBy"] = req_data.get("editedBy", "USER")
                if req_data.get("isAdmin", False):
                    comment["locked"] = True
                updated = True
                break
        if not updated:
            return jsonify({"error": "댓글을 찾을 수 없습니다."}), 404
        post["updatedAt"] = datetime.now(timezone.utc).isoformat()
        es.index(index=index_name, id=str(post_id), body=post)
        return jsonify({"message": "댓글이 수정되었습니다."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Forum 댓글 삭제 (논리 삭제)
@app.route("/forum/comment/<int:comment_id>", methods=["DELETE"])
def delete_forum_comment(comment_id):
    """
    댓글 삭제 (Forum, 논리 삭제)
    KR: 특정 댓글의 content를 "[Removed]"로 변경하고, hidden 상태를 true로 설정합니다.
        삭제 이력은 'forum_comment_history' 인덱스에 기록됩니다.
    """
    try:
        post_id = request.args.get("postId")
        if not post_id:
            return jsonify({"error": "postId 파라미터가 필요합니다."}), 400

        index_name, _ = get_index_and_mapping("forum_post")
        post = es.get(index=index_name, id=str(post_id))["_source"]
        comments = post.get("comments", [])
        deleted = False
        for comment in comments:
            if comment.get("id") == comment_id:
                history = {
                    "commentId": comment_id,
                    "content": comment.get("content"),
                    "authorName": comment.get("member", {}).get("nickName", "Unknown"),
                    "deletedAt": datetime.now(timezone.utc).isoformat()
                }
                es.index(index="forum_comment_history", body=history)
                comment["content"] = "[Removed]"
                comment["hidden"] = True
                comment["removedBy"] = request.args.get("removedBy", "USER")
                comment["updatedAt"] = datetime.now(timezone.utc).isoformat()
                deleted = True
                break
        if not deleted:
            return jsonify({"error": "댓글을 찾을 수 없습니다."}), 404
        post["updatedAt"] = datetime.now(timezone.utc).isoformat()
        es.index(index=index_name, id=str(post_id), body=post)
        return jsonify({"message": "댓글이 삭제되었습니다."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Forum 댓글 신고 처리
@app.route("/forum/comment/<int:comment_id>/report", methods=["POST"])
def report_forum_comment(comment_id):
    """
    댓글 신고 처리 (Forum)
    KR: 신고자 ID와 신고 사유를 받아 해당 댓글의 reportCount를 증가시키고,
         신고 임계값 이상이면 댓글을 숨김 처리합니다.
    """
    try:
        req_data = request.json
        reporter_id = req_data.get("reporterId")
        reason = req_data.get("reason")
        if not reporter_id or not reason:
            return jsonify({"error": "신고자 ID와 신고 사유가 필요합니다."}), 400
        REPORT_THRESHOLD = 10
        post_id = req_data.get("postId")
        if not post_id:
            return jsonify({"error": "postId 필드가 필요합니다."}), 400
        index_name, _ = get_index_and_mapping("forum_post")
        post = es.get(index=index_name, id=str(post_id))["_source"]
        comments = post.get("comments", [])
        updated = False
        for comment in comments:
            if comment.get("id") == comment_id:
                if comment.get("member", {}).get("memberId") == reporter_id:
                    return jsonify({"error": "자신의 댓글은 신고할 수 없습니다."}), 400
                comment["reportCount"] = comment.get("reportCount", 0) + 1
                if comment["reportCount"] >= REPORT_THRESHOLD:
                    comment["hidden"] = True
                comment["updatedAt"] = datetime.now(timezone.utc).isoformat()
                updated = True
                break
        if not updated:
            return jsonify({"error": "댓글을 찾을 수 없습니다."}), 404
        post["updatedAt"] = datetime.now(timezone.utc).isoformat()
        es.index(index=index_name, id=str(post_id), body=post)
        return jsonify({"message": "댓글이 신고되었습니다."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Forum 카테고리 조회 - 수정된 엔드포인트
@app.route("/forum/category", methods=["GET"])
def get_forum_categories():
    """
    포럼 카테고리 조회 (Forum)
    KR: ES의 'forum_category' 인덱스에서 모든 카테고리 문서를 검색하여 반환합니다.
    """
    try:
        index_name, _ = get_index_and_mapping("forum_category")
        # Use a match_all query to return all documents
        body = {"query": {"match_all": {}}}
        res = es.search(index=index_name, body=body)
        # Map ES results to include the ES-generated _id as 'id'
        categories = [{**hit["_source"], "id": hit["_id"]} for hit in res["hits"]["hits"]]
        return jsonify(categories), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Forum 카테고리 생성 엔드포인트 (POST)
@app.route("/forum/category", methods=["POST"])
def create_forum_category():
    """
    포럼 카테고리 생성 (Forum)
    KR: 클라이언트로부터 받은 카테고리 데이터를 기반으로 ES의 'forum_category' 인덱스에 새로운 카테고리 문서를 생성합니다.
    """
    try:
        data = request.json  # 클라이언트로부터 JSON 데이터 수신
        if not data:
            return jsonify({"error": "데이터가 제공되지 않았습니다."}), 400

        # 변경: 'forum' -> 'forum_category'
        index_name, mapping_file = get_index_and_mapping("forum_category")
        if not es.indices.exists(index=index_name):
            create_index_if_not_exists(index_name, mapping_file)

        # ES에 데이터 삽입 (새 카테고리 생성)
        res = es.index(index=index_name, body=data)
        return jsonify({"message": "카테고리가 생성되었습니다.", "id": res["_id"]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -----------------------------
# 새 Forum 카테고리 검색 엔드포인트
# -----------------------------
@app.route("/forum/category/search", methods=["GET"])
def search_forum_category():
    """
    포럼 카테고리 검색 엔드포인트
    KR: 주어진 제목(title)으로 'forum_category' 인덱스에서 해당 카테고리를 검색합니다.
        만약 검색 결과가 있으면 해당 문서를 반환하고, 없으면 404 에러를 반환합니다.
    """
    try:
        title = request.args.get("title", "")
        if not title:
            return jsonify({"error": "title 파라미터가 필요합니다."}), 400

        index_name, _ = get_index_and_mapping("forum_category")
        # Elasticsearch에서 제목 매칭 쿼리 구성 (필요에 따라 필드명을 수정할 수 있습니다)
        body = {
            "query": {
                "match": {"title": title}
            }
        }
        res = es.search(index=index_name, body=body)
        hits = res.get("hits", {}).get("hits", [])
        if hits:
            # 첫 번째 매칭된 문서를 반환합니다.
            doc = hits[0]
            source = doc["_source"]
            source["id"] = doc["_id"]  # ES의 _id를 'id' 필드로 매핑
            return jsonify(source), 200
        else:
            return jsonify({"error": "Not Found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/model/train", methods=["POST"])
def train_machine_learning():
    try:
        index_type = request.args.get("type", "")
        if not index_type:
            return jsonify({"message": "type이 비어있습니다. "})
        index_name, _ = get_index_and_mapping(index_type)
        df = fetch_data_from_es(index_name)
        train_machine_learning(df, index_type)
        return jsonify({"message": index_type + " 모델 생성에 성공했습니다."}),200
    except Exception as e:
        print(e)
        return jsonify({"message": index_type + " 모델 생성중 에러 : " + str(e)}), 500

@app.route("/model/predict", methods=["POST"])
def predict_machine_learning():
    try:
        index_type = request.args.get("type", "")
        if not index_type:
            return jsonify({"message": "type이 비어있습니다. "})
        data = request.json
        if not data:
            return jsonify({"message": "데이터가 비었습니다."})
        index_name, _ = get_index_and_mapping(index_type)
        df = fetch_data_from_es(index_name)
        ing_vec, major_vec, minor_vec, abv_sca = load_tfidf_models(index_type)
        recommendation = recommend_recipe(data, df, ing_vec, major_vec, minor_vec, abv_sca)
        return jsonify(recommendation), 200
    except Exception as e:
        print(e)
        return jsonify({"message": index_type + " 모델 사용중 에러 : " + str(e)}), 500



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)