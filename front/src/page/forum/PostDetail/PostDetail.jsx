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

  // 모달 (게시글 수정/삭제/신고 등)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    type: "",
    id: null,
    content: "",
  });

  // 게시글 인용(답글) 요청 (CommentsContainer에서 처리)
  const [postToReply, setPostToReply] = useState(null);

  // ------------------------------
  // (A) 게시글 좋아요
  // ------------------------------
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

  // ------------------------------
  // (B) 댓글 좋아요 (선택)
  // ------------------------------
  const handleLikeComment = async (commentId) => {
    try {
      await ForumApi.toggleLikeComment(commentId, user.id, postId);
      toast.success("댓글 좋아요 상태가 변경되었습니다.");
    } catch (error) {
      console.error("댓글 좋아요 처리 중 오류:", error);
      toast.error("댓글 좋아요에 실패했습니다.");
    }
  };

  // ------------------------------
  // (C) 게시글 인용(답글)
  // ------------------------------
  const handleReply = (target, type) => {
    if (type === "post") {
      setPostToReply(target);
    }
    toast.info(`${target.authorName}님의 내용을 인용합니다.`);
  };

  // ------------------------------
  // (D) 모달 열기 (게시글 수정/삭제/신고)
  // ------------------------------
  const openModal = (type, id, content) => {
    setModalData({ type, id, content });
    setIsModalOpen(true);
  };

  // ------------------------------
  // (E) 모달 확인 버튼 처리
  // ------------------------------
  const handleModalConfirm = async (inputVal) => {
    try {
      switch (modalData.type) {
        case "deletePost": {
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
          // 게시글 내용 수정
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
          // 게시글 제목 수정
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
          // 게시글 신고
          if (!inputVal.trim()) {
            toast.warning("신고 사유를 입력해주세요.");
            return;
          }
          await ForumApi.reportPost(modalData.id, user.id, inputVal);
          toast.success("게시글 신고가 접수되었습니다.");
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

  // ------------------------------
  // (F) 모달 취소
  // ------------------------------
  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  // ------------------------------
  // (G) 게시글 복원 (모달 없이)
  // ------------------------------
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

  // ------------------------------
  // (H) 게시글 데이터 불러오기
  // ------------------------------
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postData = await ForumApi.getPostById(postId);

        // (H-1) 관리자 수정 여부를 플래그로 세팅 (제목)
        if (postData.editedByTitle === "ADMIN") {
          postData.editedByAdminTitle = true;
        } else {
          postData.editedByAdminTitle = false;
        }

        // (H-2) 관리자 수정 여부를 플래그로 세팅 (내용)
        if (postData.editedByContent === "ADMIN") {
          postData.editedByAdminContent = true;
        } else {
          postData.editedByAdminContent = false;
        }

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

  // ------------------------------
  // (I) 렌더링
  // ------------------------------
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
          {/* (I-1) 게시글 제목 + (관리자/작성자) 수정 아이콘 */}
          <PostTitle>
            {post.hidden ? (
              <HiddenCommentNotice>
                NOTICE: 해당 게시글은 삭제되거나 숨김 처리되었습니다.
              </HiddenCommentNotice>
            ) : (
              <>
                {/* 실제 제목 표시 */}
                <span>{post.title}</span>

                {/* (I-1a) 만약 "제목"이 관리자에 의해 수정된 경우 => 표시 */}
                {post.editedByAdminTitle && (
                  <AdminEditIndicator style={{ marginLeft: "8px" }}>
                    [관리자에 의해 제목 수정됨]
                  </AdminEditIndicator>
                )}

                {/* (I-1b) 제목 수정 아이콘: 관리자 or (작성자 && 관리자 미수정) */}
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
              </>
            )}
          </PostTitle>

          {/* (I-2) 생성일 */}
          <div style={{ color: "#777", marginBottom: "1rem" }}>
            생성일: {Commons.formatDateAndTime(post.createdAt)}
          </div>

          {/* (I-3) PostBox에 게시글 데이터 전달 */}
          <PostBox
            post={post}
            memberId={user.id}
            isAdmin={user.admin}
            loading={loading}
            onDeletePost={(pid) => openModal("deletePost", pid, "")}
            onEditPostContent={(pid, cJSON) =>
              openModal("editPostContent", pid, cJSON)
            }
            onReportPost={(pid, content) =>
              openModal("reportPost", pid, content)
            }
            onRestorePost={handleRestorePost}
            onLikePost={handleLikePost}
            onReplyPost={handleReply}
          />

          <Divider />

          {/* (I-4) 댓글 섹션 */}
          <CommentsContainer
            postId={postId}
            user={user}
            postToReply={postToReply}
            setPostToReply={setPostToReply}
            onLikeComment={handleLikeComment}
          />
        </>
      )}

      {/* (I-5) Toast 및 모달 */}
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
