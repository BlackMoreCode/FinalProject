// PostBox.jsx
import React from "react";
import {
  PostHeader,
  AuthorInfo,
  ContentInfo,
  ActionButtons,
  InlineBlockContainer,
  HiddenCommentNotice,
  AdminEditIndicator,
  ReportCountText,
} from "../style/PostDetailStyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDeleteLeft,
  faEdit,
  faCircleExclamation,
  faThumbsUp,
  faReply,
  faUndo,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import ReadOnlyEditor from "../ReadOnlyEditor";

// (1) JSON 안전 파싱
function parseJSONSafe(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn("Invalid JSON string:", error);
    return null;
  }
}

// (2) TipTap JSON 유효성 검사
function isValidJSONContent(json) {
  if (!json) return false;
  if (json.type !== "doc") return false;
  if (!Array.isArray(json.content)) return false;
  return true;
}

// (3) HTML 렌더링용 컴포넌트
const HtmlContent = ({ html }) => (
  <div dangerouslySetInnerHTML={{ __html: html }} />
);

const PostBox = ({
  post,
  memberId,
  isAdmin,
  loading,
  onDeletePost,
  onEditPostContent,
  onReportPost,
  onRestorePost,
  onLikePost,
  onReplyPost,
}) => {
  if (!post) return null;

  // (A) 게시글 contentJSON 파싱
  const parsedJSON = parseJSONSafe(post.contentJSON);
  const shouldUseTipTap = isValidJSONContent(parsedJSON);

  return (
    <PostHeader style={{ marginBottom: "15px" }}>
      {/* (B) 작성자 정보 */}
      <AuthorInfo>
        <p>
          <strong>게시자:</strong> {post.authorName}
        </p>
        <p>
          <strong>생성일:</strong> {new Date(post.createdAt).toLocaleString()}
        </p>
      </AuthorInfo>

      {/* (C) 게시글 내용 + 액션 버튼 */}
      <ContentInfo style={{ width: "100%" }}>
        {post.hidden ? (
          <HiddenCommentNotice>
            NOTICE: 해당 게시글은 삭제되거나 숨김 처리되었습니다.
          </HiddenCommentNotice>
        ) : (
          <InlineBlockContainer>
            <div>
              {/* TipTap JSON 유효하면 ReadOnlyEditor, 아니면 HTML */}
              {shouldUseTipTap ? (
                <ReadOnlyEditor
                  key={`${JSON.stringify(parsedJSON)}-${post.updatedAt}`}
                  contentJSON={parsedJSON}
                />
              ) : (
                <HtmlContent html={post.content} />
              )}
            </div>
            {/* (C-1) 관리자에 의해 내용이 수정되었다면 표시 */}
            {post.editedByAdminContent && (
              <AdminEditIndicator>
                [관리자에 의해 내용 수정됨]
              </AdminEditIndicator>
            )}
          </InlineBlockContainer>
        )}

        {/* (D) 액션 버튼 */}
        <ActionButtons>
          <div className="left">
            <report-button onClick={() => onReportPost(post.id, post.content)}>
              <FontAwesomeIcon icon={faCircleExclamation} />
              {/* 관리자라면 reportCount 표시 */}
              {isAdmin && post.reportCount !== undefined && (
                <ReportCountText>{post.reportCount}</ReportCountText>
              )}
            </report-button>

            {/* 원 작성자 && 관리자수정 안 된 경우 => 삭제/수정 */}
            {memberId === post.memberId &&
              !isAdmin &&
              !post.editedByAdminContent && (
                <>
                  <button onClick={() => onDeletePost(post.id)}>
                    <FontAwesomeIcon icon={faDeleteLeft} />
                  </button>
                  <button
                    onClick={() => onEditPostContent(post.id, post.contentJSON)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </>
              )}

            {/* 관리자 => 무조건 삭제/수정 가능 */}
            {isAdmin && (
              <>
                <admin-button onClick={() => onDeletePost(post.id)}>
                  <FontAwesomeIcon icon={faDeleteLeft} />
                </admin-button>
                <admin-button
                  onClick={() => onEditPostContent(post.id, post.contentJSON)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </admin-button>
              </>
            )}
          </div>

          <div className="right">
            {/* 좋아요 / 인용 버튼 */}
            <button onClick={() => onLikePost(post.id)}>
              <FontAwesomeIcon icon={faThumbsUp} /> {post.likesCount}
            </button>
            <button onClick={() => onReplyPost(post, "post")}>
              <FontAwesomeIcon icon={faReply} />
            </button>

            {/* (D-1) 관리자 && 숨김 => 복원 버튼 */}
            {isAdmin && post.hidden && (
              <button onClick={() => onRestorePost(post.id)} disabled={loading}>
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  <>
                    <FontAwesomeIcon icon={faUndo} /> 복원
                  </>
                )}
              </button>
            )}
          </div>
        </ActionButtons>
      </ContentInfo>
    </PostHeader>
  );
};

export default PostBox;
