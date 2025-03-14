// CommentsContainer.jsx
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ForumApi from "../../../api/ForumApi";
import CommentList from "./CommentList";
import CommentInput from "./CommentInput";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import Blockquote from "@tiptap/extension-blockquote";

/**
 * HTML -> blockquote 변환 시 사용되는 간단한 함수
 * (기존에 사용하던 convertHtmlToJson, stripHTML 로직이 있으면 재사용 가능)
 */
const convertHtmlToJson = (html) => ({
  type: "doc",
  content: [
    { type: "paragraph", content: [{ type: "text", text: html || "" }] },
  ],
});

/**
 * 댓글 로직을 전담하는 컨테이너
 * - postId와 user(사용자 정보)를 props로 받습니다.
 * - 댓글 목록을 가져오고, 댓글 추가, 삭제, 인용(답글) 등의 로직을 여기서 처리합니다.
 */
const CommentsContainer = ({ postId, user }) => {
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [loading, setLoading] = useState(true);

  // TipTap 에디터 인스턴스 생성 (댓글 작성용)
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Link.configure({ openOnClick: false }),
      TextStyle,
      Blockquote, // 블록 인용(blockquote) 사용
    ],
    content: "",
  });

  // ==============================
  // 1) 댓글 목록 불러오기
  // ==============================
  const fetchComments = async () => {
    try {
      const data = await ForumApi.getCommentsByPostId(postId);
      // 정렬
      const sorted = data.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      // contentJSON이 없거나 잘못된 경우 HTML을 JSON으로 변환
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

  // 컴포넌트가 마운트되면 댓글 목록 불러오기
  useEffect(() => {
    fetchComments();
  }, [postId]);

  // ==============================
  // 2) 댓글 추가
  // ==============================
  const handleAddComment = async () => {
    if (!editor) return;
    const jsonData = editor.getJSON();
    const htmlData = editor.getHTML();

    // 댓글 내용이 비어있으면 경고
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
      // 댓글 추가 후 목록 재조회
      await fetchComments();
      // 에디터 내용 비우기
      editor.commands.clearContent();
      setReplyingTo(null);
      toast.success("댓글이 성공적으로 추가되었습니다.");
    } catch (error) {
      console.error("댓글 추가 중 오류:", error);
      toast.error("댓글 추가에 실패했습니다.");
    }
  };

  // ==============================
  // 3) 댓글 삭제
  // ==============================
  const handleDeleteComment = async (commentId) => {
    try {
      // ForumApi.deleteComment(댓글ID, user.id, user.admin)
      await ForumApi.deleteComment(commentId, user.id, user.admin);
      toast.success("댓글이 삭제되었습니다.");
      // 목록 재조회
      await fetchComments();
    } catch (error) {
      console.error("댓글 삭제 중 오류:", error);
      toast.error("댓글 삭제에 실패했습니다.");
    }
  };

  // ==============================
  // 4) 댓글 인용(답글)
  // ==============================
  const handleReply = (target, type) => {
    // target: 인용할 대상 (게시글 or 댓글), type: "post" or "comment"
    if (!editor) return;

    // 인용 대상의 contentJSON 파싱
    let parsedJson;
    if (target.contentJSON) {
      if (typeof target.contentJSON === "string") {
        try {
          parsedJson = JSON.parse(target.contentJSON);
        } catch {
          parsedJson = convertHtmlToJson(target.content);
        }
      } else {
        parsedJson = target.contentJSON;
      }
    } else {
      parsedJson = convertHtmlToJson(target.content);
    }

    // 인용할 본문 (parsedJson.content)
    const rawBody = (parsedJson && parsedJson.content) || [];

    // 간단히 blockquote로 감싸기
    const headerParagraph = {
      type: "paragraph",
      attrs: { class: "reply-quote-header" },
      content: [
        { type: "text", text: `${target.authorName}님이 말씀하셨습니다:` },
      ],
    };
    const bodyParagraph = {
      type: "paragraph",
      content:
        rawBody.length > 0
          ? rawBody
          : [{ type: "text", text: "(내용이 없습니다.)" }],
    };

    const quotedContent = {
      type: "blockquote",
      attrs: { class: "reply-quote" },
      content: [headerParagraph, bodyParagraph],
    };

    // 기존 에디터 내용 불러오기
    const current = editor.getJSON();
    // 맨 앞에 blockquote를 prepend
    const newContent =
      !current.content || current.content.length === 0
        ? {
            type: "doc",
            content: [quotedContent, { type: "paragraph", content: [] }],
          }
        : { ...current, content: [quotedContent, ...current.content] };

    // 에디터에 새로운 내용 세팅
    editor.commands.setContent(newContent);
    editor.chain().focus().run();

    // 인용 중임을 state로 표시 (댓글 추가 시 사용)
    if (type === "post") {
      setReplyingTo({
        type,
        opAuthorName: target.authorName,
        opContent: target.contentJSON
          ? typeof target.contentJSON === "string"
            ? target.contentJSON
            : JSON.stringify(target.contentJSON)
          : JSON.stringify(convertHtmlToJson(target.content)),
      });
    } else {
      setReplyingTo({ type, parentCommentId: target.id });
    }

    toast.info(`${target.authorName}님의 내용을 인용합니다.`);
  };

  // ==============================
  // 5) 댓글 좋아요
  // ==============================
  const handleLikeComment = async (commentId) => {
    try {
      const updated = await ForumApi.toggleLikeComment(commentId, user.id);
      // updated = { totalLikes, liked, ... }
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, likesCount: updated.totalLikes, liked: updated.liked }
            : c
        )
      );
      toast.success("댓글 좋아요 상태가 변경되었습니다.");
    } catch (error) {
      console.error("댓글 좋아요 오류:", error);
      toast.error("좋아요 처리에 실패했습니다.");
    }
  };

  if (loading) return <div>댓글 로딩 중...</div>;

  return (
    <div>
      {/* 댓글 목록 */}
      <CommentList
        comments={comments}
        memberId={user.id}
        isAdmin={user.admin}
        // Delete
        onDeleteComment={handleDeleteComment}
        // Like
        onLikeComment={handleLikeComment}
        // Reply
        onReply={handleReply}
        // 기타 수정, 신고, 복원 로직도 이곳에 추가 가능
        // e.g. onReportComment, onRestoreComment, etc.
      />

      {/* 댓글 입력 */}
      <CommentInput
        editor={editor}
        replyingTo={replyingTo}
        onAddComment={handleAddComment}
        onCancelReply={() => setReplyingTo(null)}
        // Link-related handlers if needed
        onAddLink={() => {}}
      />
    </div>
  );
};

export default CommentsContainer;
