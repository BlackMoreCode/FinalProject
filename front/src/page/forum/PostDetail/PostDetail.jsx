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
} from "../style/PostDetailStyles";
import PostBox from "./PostBox";
import CommentsContainer from "./CommentsContainer";
import Commons from "../../../util/Common";
import styled from "styled-components";
import { useSelector } from "react-redux";
import ConfirmationModal from "../ConfirmationModal";
import { createReplyBlock } from "./replyUtils";
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
  // 모달 관련 상태 (게시글 수정, 삭제 등)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    type: "",
    id: null,
    content: "", // 모달에서 편집할 데이터(문자열 또는 객체)
  });
  // 게시글 인용 요청(CommentsContainer에서 처리)
  const [postToReply, setPostToReply] = useState(null);

  // 게시글 좋아요 토글
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

  // (선택) 댓글 좋아요 처리 예시
  const handleLikeComment = async (commentId) => {
    try {
      const updatedComment = await ForumApi.toggleLikeComment(
        commentId,
        user.id,
        postId
      );
      toast.success("댓글 좋아요 상태가 변경되었습니다.");
    } catch (error) {
      console.error("댓글 좋아요 처리 중 오류:", error);
      toast.error("좋아요 처리에 실패했습니다.");
    }
  };

  // 게시글 인용(답글)
  const handleReply = (target, type) => {
    if (type === "post") {
      setPostToReply(target);
    } else {
      console.log("댓글 인용 처리:", target);
    }
    toast.info(`${target.authorName}님의 내용을 인용합니다.`);
  };

  // 모달 열기 함수 (게시글 수정/삭제용)
  const openModal = (type, id, content) => {
    setModalData({ type, id, content });
    setIsModalOpen(true);
  };

  // 모달 확인 버튼 클릭 시 처리 (게시글 수정/삭제, 신고)
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

  // 모달 취소 함수
  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  // 게시글 복원을 바로 처리하는 함수 (모달 없이)
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

  // 게시글 데이터 불러오기
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postData = await ForumApi.getPostById(postId);
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
          <PostTitle>
            {post.hidden ? (
              <HiddenCommentNotice>
                NOTICE: 해당 게시글은 삭제되거나 숨김 처리되었습니다.
              </HiddenCommentNotice>
            ) : (
              <>
                <span>{post.title}</span>
                {user.id === post.memberId && (
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
                )}
              </>
            )}
          </PostTitle>

          <div style={{ color: "#777", marginBottom: "1rem" }}>
            생성일: {Commons.formatDateAndTime(post.createdAt)}
          </div>

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
            // onRestorePost prop을 직접 복원 처리하는 함수로 전달합니다.
            onRestorePost={handleRestorePost}
            onLikePost={handleLikePost}
            onReplyPost={handleReply}
          />

          <Divider />

          <CommentsContainer
            postId={postId}
            user={user}
            postToReply={postToReply}
            setPostToReply={setPostToReply}
            onLikeComment={handleLikeComment}
          />
        </>
      )}

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
