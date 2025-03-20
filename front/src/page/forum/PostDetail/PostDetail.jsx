// PostDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ForumApi from "../../../api/ForumApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  PostDetailContainer,
  ReplyQuoteGlobalStyle,
  GlobalKeyframes,
  PostTitle,
  HiddenCommentNotice,
  DisabledEditButton, // 비활성화 버튼 스타일
  AdminEditIndicator, // 관리자 수정 표시 스타일
} from "../style/PostDetailStyles";
import PostBox from "./PostBox";
import CommentsContainer from "./CommentsContainer";
import Commons from "../../../util/Common";
import styled from "styled-components";
import { useSelector } from "react-redux";
import ConfirmationModal from "../ConfirmationModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #ccc;
  margin: 1rem 0;
`;

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  // 모달 상태: 게시글 수정/삭제/신고, 댓글 신고 등
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    type: "", // "deletePost", "editPostContent", "editPostTitle", "reportPost", "reportComment" 등
    id: null, // 신고/수정/삭제 대상 ID (게시글 ID 또는 댓글 ID)
    content: "", // 모달에 표시할 초기 내용 (예: 기존 제목, 신고 사유 등)
  });
  // 게시글 인용(답글) 요청 (CommentsContainer에서 처리)
  const [postToReply, setPostToReply] = useState(null);

  // (A) 게시글 좋아요 처리 함수
  const handleLikePost = async (pid) => {
    try {
      const updatedPost = await ForumApi.toggleLikePost(pid, user.id);
      setPost((prev) => ({
        ...prev,
        likesCount: updatedPost.likesCount,
        liked: updatedPost.liked,
        updatedAt: updatedPost.updatedAt || new Date().toISOString(),
      }));
      toast.success("게시글 좋아요 상태가 변경되었습니다.");
    } catch (error) {
      console.error("게시글 좋아요 처리 중 오류:", error);
      toast.error("좋아요 처리에 실패했습니다.");
    }
  };

  // (B) 댓글 좋아요 처리 함수
  const handleLikeComment = async (commentId) => {
    try {
      await ForumApi.toggleLikeComment(commentId, user.id, postId);
      toast.success("댓글 좋아요 상태가 변경되었습니다.");
    } catch (error) {
      console.error("댓글 좋아요 처리 중 오류:", error);
      toast.error("댓글 좋아요에 실패했습니다.");
    }
  };

  // (C) 게시글 인용(답글) 처리 함수
  const handleReply = (target, type) => {
    if (type === "post") {
      setPostToReply(target);
    }
    toast.info(`${target.authorName}님의 내용을 인용합니다.`);
  };

  // (D) 모달 열기 함수 (수정/삭제/신고 등)
  const openModal = (type, id, content) => {
    setModalData({ type, id, content });
    setIsModalOpen(true);
  };

  // (E) 신고 관련 핸들러
  // 게시글 신고: 모달을 통해 신고 사유 입력
  const handleReportPost = (pid) => {
    openModal("reportPost", pid, "");
  };
  // 댓글 신고: 모달을 통해 신고 사유 입력
  const handleReportComment = (commentId) => {
    openModal("reportComment", commentId, "");
  };

  // (F) 모달 확인 버튼 처리 함수
  const handleModalConfirm = async (inputVal) => {
    try {
      switch (modalData.type) {
        case "deletePost": {
          // 게시글 삭제 요청
          await ForumApi.deletePost(
            modalData.id,
            user.id,
            user.admin ? "ADMIN" : user.name,
            user.admin
          );
          toast.success("게시글이 삭제되었습니다.");
          navigate("/forum");
          break;
        }
        case "editPostContent": {
          // 게시글 내용 수정 요청
          const payload = {
            contentJSON:
              typeof inputVal === "object"
                ? JSON.stringify(inputVal)
                : inputVal,
            editedBy: user.admin ? "ADMIN" : String(user.id),
            isAdmin: user.admin ? "true" : "false",
          };
          const updated = await ForumApi.updatePostContent(
            modalData.id,
            payload,
            user.id,
            user.admin
          );
          setPost((prev) => ({
            ...prev,
            contentJSON: updated.contentJSON,
            updatedAt: updated.updatedAt || new Date().toISOString(),
          }));
          toast.success("게시글 내용이 수정되었습니다.");
          break;
        }
        case "editPostTitle": {
          // 게시글 제목 수정 요청
          if (!inputVal.trim()) {
            toast.warning("제목을 입력해주세요.");
            return;
          }
          const payload = {
            title: inputVal,
            editedBy: user.admin ? "ADMIN" : String(user.id),
            isAdmin: user.admin ? "true" : "false",
          };
          const updated = await ForumApi.updatePostTitle(
            modalData.id,
            payload,
            user.id,
            user.admin
          );
          setPost((prev) => ({
            ...prev,
            title: updated.title,
            updatedAt: updated.updatedAt || new Date().toISOString(),
          }));
          toast.success("게시글 제목이 수정되었습니다.");
          break;
        }
        case "reportPost": {
          // 게시글 신고 요청
          if (!inputVal.trim()) {
            toast.warning("신고 사유를 입력해주세요.");
            return;
          }
          await ForumApi.reportPost(modalData.id, user.id, inputVal);
          // 신고 후, 게시글 전체 데이터를 다시 불러옴 (modalData.id가 게시글 ID여야 함)
          const updatedPost = await ForumApi.getPostById(modalData.id);
          setPost(updatedPost);
          toast.success("게시글 신고가 접수되었습니다.");
          break;
        }
        case "reportComment": {
          // 댓글 신고 요청
          if (!inputVal.trim()) {
            toast.warning("신고 사유를 입력해주세요.");
            return;
          }
          // 신고 요청 시 반드시 { reporterId, reason, postId }를 포함하여 전송
          await ForumApi.reportComment(modalData.id, user.id, inputVal, postId);
          // 신고 후, 전체 게시글 데이터를 postId를 이용해 다시 불러옴
          const updatedPost = await ForumApi.getPostById(postId);
          setPost(updatedPost);
          toast.success("댓글 신고가 접수되었습니다.");
          break;
        }
        default:
          console.log("모달 액션:", modalData.type, "입력값:", inputVal);
      }
    } catch (error) {
      console.error("모달 액션 처리 중 오류:", error);
      toast.error("작업 처리에 실패했습니다.");
    } finally {
      setIsModalOpen(false);
    }
  };

  // (G) 모달 취소 처리 함수
  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  // (H) 게시글 복원 처리 (모달 없이)
  const handleRestorePost = async (pid) => {
    try {
      await ForumApi.restorePost(pid);
      const updatedPost = await ForumApi.getPostById(pid);
      setPost(updatedPost);
      toast.success("게시글이 복원되었습니다.");
    } catch (error) {
      console.error("게시글 복원 중 오류:", error);
      toast.error("게시글 복원에 실패했습니다.");
    }
  };

  // (I) 게시글 데이터 불러오기
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postData = await ForumApi.getPostById(postId);
        // 관리자에 의한 수정 여부 플래그 설정
        postData.editedByAdminTitle = postData.editedByTitle === "ADMIN";
        postData.editedByAdminContent = postData.editedByContent === "ADMIN";
        setPost(postData);
      } catch (error) {
        console.error("게시글 로딩 중 오류:", error);
        toast.error("게시글 데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchPostData();
  }, [postId, navigate]);

  // (J) 렌더링
  return (
    <PostDetailContainer>
      <ReplyQuoteGlobalStyle />
      <GlobalKeyframes />

      {loading ? (
        <div>로딩 중...</div>
      ) : !post ? (
        <div>게시글을 찾을 수 없습니다.</div>
      ) : (
        <>
          {/* (J-1) 게시글 제목 및 수정 아이콘 */}
          <PostTitle>
            {post.hidden ? (
              <HiddenCommentNotice>
                NOTICE: 해당 게시글은 삭제되거나 숨김 처리되었습니다.
              </HiddenCommentNotice>
            ) : (
              <>
                <span>{post.title}</span>
                {/* 관리자 계정이면 무조건 수정 아이콘을 표시, 일반 사용자는 본인 글에 한해 수정 가능 */}
                {user.admin ? (
                  <FontAwesomeIcon
                    icon={faEdit}
                    style={{
                      cursor: "pointer",
                      marginLeft: "8px",
                      color: "#ff9900",
                    }}
                    onClick={() =>
                      openModal("editPostTitle", post.id, post.title)
                    }
                  />
                ) : (
                  <>
                    {user.id === post.memberId ? (
                      post.editedByAdminTitle ? (
                        <DisabledEditButton>
                          <FontAwesomeIcon icon={faEdit} />
                        </DisabledEditButton>
                      ) : (
                        <FontAwesomeIcon
                          icon={faEdit}
                          style={{
                            cursor: "pointer",
                            marginLeft: "8px",
                            color: "#007bff",
                          }}
                          onClick={() =>
                            openModal("editPostTitle", post.id, post.title)
                          }
                        />
                      )
                    ) : null}
                  </>
                )}
                {/* 관리자에 의해 제목 수정된 경우 표시 */}
                {post.editedByAdminTitle && (
                  <AdminEditIndicator style={{ marginLeft: "8px" }}>
                    [관리자에 의해 제목 수정됨]
                  </AdminEditIndicator>
                )}
              </>
            )}
          </PostTitle>

          {/* (J-2) 생성일 표시 */}
          <div style={{ color: "#777", marginBottom: "1rem" }}>
            생성일: {Commons.formatDateAndTime(post.createdAt)}
          </div>

          {/* (J-3) PostBox 컴포넌트에 게시글 데이터 전달 */}
          <PostBox
            post={post}
            memberId={user.id}
            isAdmin={user.admin}
            loading={loading}
            onDeletePost={(pid) => openModal("deletePost", pid, "")}
            onEditPostContent={(pid, cJSON) =>
              openModal("editPostContent", pid, cJSON)
            }
            onReportPost={handleReportPost}
            onRestorePost={handleRestorePost}
            onLikePost={handleLikePost}
            onReplyPost={handleReply}
          />

          <Divider />

          {/* (J-4) 댓글 섹션 */}
          <CommentsContainer
            postId={postId}
            user={user}
            postToReply={postToReply}
            setPostToReply={setPostToReply}
            onLikeComment={handleLikeComment}
            onReportComment={handleReportComment}
          />
        </>
      )}

      {/* (J-5) Toast 및 ConfirmationModal */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <ConfirmationModal
        isOpen={isModalOpen}
        type={modalData.type}
        content={modalData.content}
        message="진행 하시겠습니까?"
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
    </PostDetailContainer>
  );
};

export default PostDetail;
