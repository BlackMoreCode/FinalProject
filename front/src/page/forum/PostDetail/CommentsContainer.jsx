import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ForumApi from "../../../api/ForumApi";
import CommentList from "./CommentList";
import CommentInput from "./CommentInput";
import ConfirmationModal from "../ConfirmationModal"; // 댓글 수정용 모달
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
  // 모달 상태 (댓글 수정)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    type: "",
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

  // 댓글 목록 불러오기 함수
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

  const handleDeleteComment = async (commentId) => {
    try {
      await ForumApi.deleteComment(commentId, postId, user.id, user.admin);
      toast.success("댓글이 삭제되었습니다.");
      await fetchComments();
    } catch (error) {
      console.error("댓글 삭제 중 오류:", error);
      toast.error("댓글 삭제에 실패했습니다.");
    }
  };

  const handleEditComment = (commentId, contentJSON) => {
    setModalData({
      type: "editComment",
      commentId,
      content: JSON.stringify(contentJSON),
    });
    setIsModalOpen(true);
  };

  const handleModalConfirm = async (inputVal) => {
    if (modalData.type === "editComment") {
      try {
        const payload = {
          postId: postId,
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
    }
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

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
        message="댓글을 수정하시겠습니까?"
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
    </div>
  );
};

export default CommentsContainer;
