// CommentsContainer.jsx
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ForumApi from "../../../api/ForumApi";
import CommentList from "./CommentList";
import CommentInput from "./CommentInput";
import ConfirmationModal from "../ConfirmationModal"; // 댓글 수정/신고용 모달
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import Blockquote from "@tiptap/extension-blockquote";
import { createReplyBlock } from "./replyUtils";

/**
 * HTML -> JSON 변환 함수
 */
const convertHtmlToJson = (html) => ({
  type: "doc",
  content: [
    { type: "paragraph", content: [{ type: "text", text: html || "" }] },
  ],
});

const CommentsContainer = ({ postId, user, postToReply, setPostToReply }) => {
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [loading, setLoading] = useState(true);
  // 모달 상태 (댓글 수정/신고)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    type: "", // 예: "editComment" 또는 "reportComment"
    commentId: null,
    content: "",
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Link.configure({ openOnClick: false }),
      TextStyle,
      Blockquote,
    ],
    content: "",
  });

  // 댓글 목록 불러오기
  const fetchComments = async () => {
    try {
      const data = await ForumApi.getCommentsByPostId(postId);
      const sorted = data.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      sorted.forEach((comment) => {
        if (comment.contentJSON) {
          try {
            if (typeof comment.contentJSON === "string") {
              comment.contentJSON = JSON.parse(comment.contentJSON);
            }
          } catch {
            comment.contentJSON = convertHtmlToJson(comment.content);
          }
        } else if (comment.content) {
          comment.contentJSON = convertHtmlToJson(comment.content);
        }
      });
      setComments(sorted);
    } catch (error) {
      console.error("댓글 로딩 중 오류:", error);
      toast.error("댓글을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  // 댓글 추가
  const handleAddComment = async () => {
    if (!editor) return;
    const jsonData = editor.getJSON();
    const htmlData = editor.getHTML();

    if (!jsonData || !jsonData.content || jsonData.content.length === 0) {
      toast.warning("댓글이 비어있거나 잘못된 형식입니다.");
      return;
    }

    try {
      await ForumApi.addComment({
        postId,
        memberId: user.id,
        content: htmlData,
        contentJSON: JSON.stringify(jsonData),
        parentCommentId: replyingTo?.parentCommentId || null,
        opAuthorName: replyingTo?.opAuthorName || null,
        opContent: replyingTo?.opContent || null,
      });
      await fetchComments();
      editor.commands.clearContent();
      setReplyingTo(null);
      toast.success("댓글이 성공적으로 추가되었습니다.");
    } catch (error) {
      console.error("댓글 추가 중 오류:", error);
      toast.error("댓글 추가에 실패했습니다.");
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    try {
      const success = await ForumApi.deleteComment(
        commentId,
        postId,
        user.id,
        user.admin
      );
      if (success) {
        toast.success("댓글이 삭제되었습니다.");
        await fetchComments();
      } else {
        toast.error("댓글 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("댓글 삭제 중 오류:", error);
      toast.error("댓글 삭제에 실패했습니다.");
    }
  };

  // 댓글 수정: 모달 열기
  const handleEditComment = (commentId, contentJSON) => {
    setModalData({
      type: "editComment",
      commentId,
      content: JSON.stringify(contentJSON),
    });
    setIsModalOpen(true);
  };

  // 신고 기능 추가: 댓글 신고 시 모달 열기
  const handleReportComment = (commentId) => {
    setModalData({
      type: "reportComment",
      commentId,
      content: "",
    });
    setIsModalOpen(true);
  };

  // 모달 확인 버튼 처리
  const handleModalConfirm = async (inputVal) => {
    if (modalData.type === "editComment") {
      try {
        const payload = {
          postId,
          contentJSON:
            typeof inputVal === "object" ? JSON.stringify(inputVal) : inputVal,
          editedBy: user.admin ? "ADMIN" : String(user.id),
          isAdmin: user.admin,
        };
        await ForumApi.editComment(
          modalData.commentId,
          payload,
          user.id,
          user.admin
        );
        await fetchComments();
        toast.success("댓글이 성공적으로 수정되었습니다.");
      } catch (error) {
        console.error("댓글 수정 중 오류:", error);
        toast.error("댓글 수정에 실패했습니다.");
      }
    } else if (modalData.type === "reportComment") {
      try {
        if (!inputVal.trim()) {
          toast.warning("신고 사유를 입력해주세요.");
          return;
        }
        await ForumApi.reportComment(
          modalData.commentId,
          user.id,
          inputVal,
          postId
        );
        await fetchComments();
        toast.success("댓글 신고가 접수되었습니다.");
      } catch (error) {
        console.error("댓글 신고 중 오류:", error);
        toast.error("댓글 신고에 실패했습니다.");
      }
    }
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  // 댓글 복원
  const handleRestoreComment = async (commentId) => {
    try {
      await ForumApi.restoreComment(commentId, postId);
      toast.success("댓글이 복원되었습니다.");
      await fetchComments();
    } catch (error) {
      console.error("댓글 복원 중 오류:", error);
      toast.error("댓글 복원에 실패했습니다.");
    }
  };

  // 댓글 좋아요
  const handleLikeComment = async (commentId) => {
    try {
      const updated = await ForumApi.toggleLikeComment(
        commentId,
        user.id,
        postId
      );
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, likesCount: updated.likesCount, liked: updated.liked }
            : c
        )
      );
      toast.success("댓글 좋아요 상태가 변경되었습니다.");
    } catch (error) {
      console.error("댓글 좋아요 오류:", error);
      toast.error("좋아요 처리에 실패했습니다.");
    }
  };

  // 댓글 인용(답글)
  const handleReply = (target, type) => {
    if (!editor) return;
    const quotedBlock = createReplyBlock(target);
    const current = editor.getJSON();
    const newContent =
      !current.content || current.content.length === 0
        ? {
            type: "doc",
            content: [quotedBlock, { type: "paragraph", content: [] }],
          }
        : { ...current, content: [quotedBlock, ...current.content] };

    editor.commands.setContent(newContent);
    editor.chain().focus().run();

    if (type === "comment") {
      setReplyingTo({ type, parentCommentId: target.id });
    }
    toast.info(`${target.authorName}님의 내용을 인용합니다.`);
  };

  if (loading) return <div>댓글 로딩 중...</div>;

  return (
    <div>
      <CommentList
        comments={comments}
        memberId={user.id}
        isAdmin={user.admin}
        onDeleteComment={handleDeleteComment}
        onEditComment={handleEditComment}
        onLikeComment={handleLikeComment}
        onReply={handleReply}
        onRestoreComment={handleRestoreComment}
        onReportComment={handleReportComment} // 신고 핸들러 추가
      />

      <CommentInput
        editor={editor}
        replyingTo={replyingTo}
        onAddComment={handleAddComment}
        onCancelReply={() => setReplyingTo(null)}
        onAddLink={() => {}}
      />

      <ConfirmationModal
        isOpen={isModalOpen}
        type={modalData.type}
        content={modalData.content}
        message="댓글을 수정하시겠습니까?" // 신고일 경우에도 동일 메시지 대신 변경 가능
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
    </div>
  );
};

export default CommentsContainer;
