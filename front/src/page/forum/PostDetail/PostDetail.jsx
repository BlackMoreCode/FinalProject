import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// ReduxApi를 통해 로그인 사용자 정보를 가져옵니다.
import ReduxApi from "../../../api/ReduxApi";
import ForumApi from "../../../api/ForumApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 스타일 컴포넌트 및 글로벌 스타일 임포트
import {
  PostDetailContainer,
  ReplyQuoteGlobalStyle,
  GlobalKeyframes,
  PostTitle,
  HiddenCommentNotice,
  AdminEditIndicator,
  EditButton,
  DisabledEditButton,
} from "../style/PostDetailStyles";

// 하위 컴포넌트 임포트
import PostBox from "./PostBox"; // 게시글 본문과 액션 버튼 렌더링 컴포넌트
import CommentList from "./CommentList"; // 댓글 목록 렌더링 컴포넌트
import CommentInput from "./CommentInput"; // 댓글 입력 에디터 컴포넌트
import ConfirmationModal from "../ConfirmationModal"; // 확인(컨펌) 모달 컴포넌트

// TipTap 에디터 관련 임포트
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import Blockquote from "@tiptap/extension-blockquote";

// FontAwesome 아이콘 임포트
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

// Commons 모듈에서 날짜/시간 포맷팅 함수 import (통일된 시간 사용)
import Commons from "../../../util/Common";

// styled-components를 이용하여 가로 구분선(Divider) 컴포넌트 생성
import styled from "styled-components";
const Divider = styled.hr`
  border: none;
  border-top: 1px solid #ccc;
  margin: 1rem 0;
`;

/**
 * HTML 태그를 제거하는 유틸 함수
 * @param {string} html - HTML 문자열
 * @returns {string} - HTML 태그가 제거된 순수 텍스트
 */
const stripHTML = (html) => {
  return html.replace(/<[^>]*>/g, "");
};

/**
 * HTML 문자열을 TipTap JSON 형식으로 변환하는 함수
 * @param {string} html - HTML 문자열
 * @returns {object} - TipTap JSON 객체
 */
const convertHtmlToJson = (html) => {
  const plainText = stripHTML(html);
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: plainText }],
      },
    ],
  };
};

const PostDetail = () => {
  const { postId } = useParams(); // URL에서 게시글 ID 추출
  const navigate = useNavigate();

  // 주요 상태값 선언
  const [post, setPost] = useState(null); // 게시글 데이터
  const [comments, setComments] = useState([]); // 댓글 목록
  const [refreshKey, setRefreshKey] = useState(0); // 댓글 업데이트 시 재마운트를 유도하는 refreshKey
  const [replyingTo, setReplyingTo] = useState(null); // 인용(답글) 대상 정보
  const [memberId, setMemberId] = useState(null); // 로그인 사용자 ID
  const [isAdmin, setIsAdmin] = useState(false); // 관리자 여부
  const [loading, setLoading] = useState(true); // 로딩 상태

  // 모달 관련 상태값 선언 (컨펌 모달)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    type: "",
    id: null,
    content: "",
  });

  // TipTap 에디터 설정 (댓글 입력용)
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

  /**
   * ReduxApi를 통해 로그인 사용자 정보를 가져오는 함수
   * 로그인 정보가 없으면 로그인 페이지로 이동합니다.
   */
  const fetchMemberData = async () => {
    try {
      const response = await ReduxApi.getMyInfo();
      const userInfo = response.data;
      if (userInfo && userInfo.id) {
        setMemberId(userInfo.id);
        // role 체크를 대소문자 무시하도록 수정
        setIsAdmin(
          userInfo.role && userInfo.role.toUpperCase().includes("ADMIN")
        );
      } else {
        toast.error("로그인이 필요합니다.");
        navigate("/login");
      }
    } catch (error) {
      console.error("사용자 정보를 가져오는 중 오류:", error);
      toast.error("사용자 정보를 확인할 수 없습니다.");
      navigate("/login");
    }
  };

  /**
   * 게시글 및 댓글 데이터를 가져오는 함수
   * KR: 1) 로그인 정보를 먼저 가져오고,
   *     2) 게시글 상세 정보와 댓글 목록을 불러와 contentJSON 필드를 파싱하거나,
   *        없으면 HTML을 JSON으로 변환합니다.
   */
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        await fetchMemberData();
        const postData = await ForumApi.getPostById(postId);
        const commentData = await ForumApi.getCommentsByPostId(postId);
        const sortedComments = commentData.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        // 댓글 contentJSON 필드가 없거나 잘못된 경우 HTML을 JSON으로 변환
        sortedComments.forEach((comment) => {
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
        setPost(postData);
        setComments(sortedComments);
      } catch (error) {
        console.error("게시글 로딩 중 오류:", error);
        toast.error("게시글 데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchPostData();
  }, [postId, navigate]);

  /**
   * 포스트/댓글 편집 모달을 열 때, content 값이 유효하지 않으면
   * 기본값({ type: "doc", content: [] })으로 대체하여 모달을 엽니다.
   *
   * @param {string} type - 작업 유형 (예: "editPostContent", "editComment")
   * @param {string|object} id - 편집 대상의 ID
   * @param {string|object} content - 편집할 콘텐츠 (TipTap JSON 형식 또는 그 문자열)
   */
  const openModal = (type, id, content) => {
    if (type === "editPostContent" || type === "editComment") {
      // content가 undefined, null, 빈 문자열 또는 "undefined"면 기본 TipTap JSON 문자열 사용
      if (!content || content === "undefined") {
        content = JSON.stringify({ type: "doc", content: [] });
      } else if (typeof content !== "string") {
        content = JSON.stringify(content);
      }
    }
    setModalData({ type, id, content });
    setIsModalOpen(true);
  };

  /**
   * 모달 확인 버튼 클릭 시 처리하는 함수
   * 입력된 값(inputVal)을 기반으로 삭제, 수정, 신고 등의 작업을 처리합니다.
   */
  const handleModalConfirm = async (inputVal) => {
    const { type, id } = modalData;
    try {
      switch (type) {
        case "deletePost": {
          const removedBy =
            memberId === post.memberId ? post.authorName : "ADMIN";
          await ForumApi.deletePost(id, memberId, removedBy, isAdmin);
          toast.success("게시글이 삭제되었습니다.");
          navigate("/forum");
          break;
        }
        case "editPostTitle": {
          if (!inputVal.trim()) return toast.warning("제목을 입력해 주세요.");
          const updatedTitle = await ForumApi.updatePostTitle(
            id,
            { title: inputVal },
            memberId,
            isAdmin
          );
          setPost((prev) => ({
            ...prev,
            title: updatedTitle.title,
            editedTitleByAdmin: updatedTitle.editedTitleByAdmin,
          }));
          toast.success("게시글 제목이 수정되었습니다.");
          break;
        }
        case "editPostContent": {
          if (!inputVal.trim()) return toast.warning("내용을 입력해 주세요.");
          let jsonContent;
          try {
            jsonContent = JSON.parse(inputVal);
          } catch {
            return toast.error("잘못된 JSON 형식입니다.");
          }
          // 안전하게 stringify 한 후 백엔드로 전송
          const updated = await ForumApi.updatePostContent(
            id,
            { contentJSON: JSON.stringify(jsonContent) },
            memberId,
            isAdmin
          );
          // 업데이트 후, 백엔드에서 최신 데이터를 재조회
          const refreshedPost = await ForumApi.getPostById(id);
          // 최신 데이터를 파싱하여 상태를 업데이트합니다.
          setPost((prev) => ({
            ...prev,
            contentJSON:
              typeof refreshedPost.contentJSON === "string"
                ? JSON.parse(refreshedPost.contentJSON)
                : refreshedPost.contentJSON,
            editedContentByAdmin: refreshedPost.editedContentByAdmin,
          }));
          toast.success("게시글 내용이 수정되었습니다.");
          break;
        }
        case "editComment": {
          if (!inputVal.trim())
            return toast.warning("댓글 내용을 입력해 주세요.");
          let jsonContent;
          try {
            jsonContent = JSON.parse(inputVal);
          } catch {
            return toast.error("잘못된 JSON 형식입니다.");
          }
          const updatedComment = await ForumApi.editComment(
            id,
            { contentJSON: JSON.stringify(jsonContent) },
            memberId,
            isAdmin
          );
          if (typeof updatedComment.contentJSON === "string") {
            try {
              updatedComment.contentJSON = JSON.parse(
                updatedComment.contentJSON
              );
            } catch {
              updatedComment.contentJSON = convertHtmlToJson(
                updatedComment.content
              );
            }
          }
          setComments((prev) =>
            prev.map((c) => (c.id === id ? { ...c, ...updatedComment } : c))
          );
          toast.success("댓글이 성공적으로 수정되었습니다.");
          break;
        }
        case "deleteComment": {
          await ForumApi.deleteComment(id, memberId, isAdmin);
          setComments((prev) =>
            prev.map((c) =>
              c.id === id
                ? {
                    ...c,
                    contentJSON: {
                      content: [{ type: "paragraph", content: [] }],
                    },
                    hidden: true,
                  }
                : c
            )
          );
          toast.success("댓글이 삭제되었습니다.");
          break;
        }
        case "restorePost": {
          if (!isAdmin) {
            toast.error("권한이 없습니다. 관리자만 복원할 수 있습니다.");
            return;
          }
          await ForumApi.restorePost(id);
          const restoredPost = await ForumApi.getPostById(id);
          if (
            restoredPost.contentJSON &&
            typeof restoredPost.contentJSON === "string"
          ) {
            try {
              restoredPost.contentJSON = JSON.parse(restoredPost.contentJSON);
            } catch {
              restoredPost.contentJSON = convertHtmlToJson(
                restoredPost.content
              );
            }
          }
          setPost(restoredPost);
          toast.success("게시글이 성공적으로 복원되었습니다.");
          break;
        }
        case "restoreComment": {
          await ForumApi.restoreComment(id);
          setTimeout(async () => {
            const commentData = await ForumApi.getCommentsByPostId(postId);
            const sorted = commentData.sort(
              (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );
            sorted.forEach((com) => {
              if (com.contentJSON && typeof com.contentJSON === "string") {
                try {
                  com.contentJSON = JSON.parse(com.contentJSON);
                } catch {
                  com.contentJSON = convertHtmlToJson(com.content);
                }
              }
            });
            setComments(sorted);
            toast.success("댓글이 복원되었습니다.");
          }, 250);
          break;
        }
        case "reportPost": {
          if (!inputVal.trim()) {
            toast.warning("신고 사유를 입력해주세요.");
            return;
          }
          await ForumApi.reportPost(id, memberId, inputVal.trim());
          toast.success("게시글 신고가 접수되었습니다.");
          break;
        }
        case "reportComment": {
          if (!inputVal.trim()) {
            toast.warning("신고 사유를 입력해주세요.");
            return;
          }
          await ForumApi.reportComment(id, memberId, inputVal.trim());
          toast.success("댓글 신고가 접수되었습니다.");
          break;
        }
        case "addLink": {
          if (!inputVal.trim()) return toast.warning("URL을 입력해주세요.");
          let url = inputVal.trim();
          if (!/^https?:\/\//i.test(url)) {
            url = "https://" + url;
          }
          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
          toast.success("링크가 성공적으로 추가되었습니다.");
          break;
        }
        default:
          toast.error("알 수 없는 작업입니다.");
      }
    } catch (error) {
      console.error(`${modalData.type} 처리 중 오류:`, error);
      toast.error("작업 처리 중 오류가 발생했습니다.");
    } finally {
      setIsModalOpen(false);
    }
  };

  // 답글(인용) 취소 함수
  const resetReplying = () => setReplyingTo(null);

  // "Link" 버튼 클릭 시 모달을 여는 함수
  const handleAddLink = () => {
    openModal("addLink", null, "");
  };

  /**
   * 인용(답글) 생성 함수
   * - 대상 콘텐츠의 JSON 유효성 검사 및 fallback 처리
   * - 인용 블록을 생성하여 에디터에 추가합니다.
   */
  const filterEmptyParagraphs = (nodes) => {
    if (!nodes || !Array.isArray(nodes)) return [];
    return nodes.filter((node) => {
      if (node.type === "paragraph") {
        if (!node.content || node.content.length === 0) return false;
        const text = node.content
          .map((n) => n.text || "")
          .join("")
          .trim();
        return text !== "";
      }
      return true;
    });
  };

  const handleReply = (target, type) => {
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

    let parsedJson;
    if (target.contentJSON) {
      if (typeof target.contentJSON === "string") {
        try {
          parsedJson = JSON.parse(target.contentJSON);
        } catch (err) {
          parsedJson = convertHtmlToJson(target.content);
        }
      } else {
        parsedJson = target.contentJSON;
      }
    } else {
      parsedJson = convertHtmlToJson(target.content);
    }

    const rawBody = (parsedJson && parsedJson.content) || [];
    const filteredBody = filterEmptyParagraphs(rawBody);

    // 인용 헤더와 본문 생성
    const headerParagraph = {
      type: "paragraph",
      attrs: { class: "reply-quote-header" },
      content: [
        { type: "text", text: `${target.authorName}님이 말씀하셨습니다:` },
      ],
    };

    const bodyParagraph = {
      type: "paragraph",
      attrs: { class: "reply-quote-body" },
      content:
        filteredBody.length > 0
          ? filteredBody
          : [{ type: "text", text: "(내용이 없습니다.)" }],
    };

    // 인용 블록 생성 (답글 누를때 인용할 부분을 보여주는 코드)
    const quotedContent = {
      type: "blockquote",
      attrs: { class: "reply-quote" },
      content: [headerParagraph, bodyParagraph],
    };

    const current = editor.getJSON();
    const newContent =
      !current.content || current.content.length === 0
        ? {
            type: "doc",
            content: [quotedContent, { type: "paragraph", content: [] }],
          }
        : { ...current, content: [quotedContent, ...current.content] };

    editor.commands.setContent(newContent);
    editor.chain().focus().run();
    toast.info(`${target.authorName}님의 내용을 인용합니다.`);
  };

  /**
   * 새 댓글 추가 함수
   * - 댓글 추가 후 전체 댓글 목록을 재조회하여 최신 상태로 업데이트합니다.
   */
  const handleAddComment = async () => {
    const jsonData = editor.getJSON();
    const htmlData = editor.getHTML();
    if (!jsonData || !jsonData.content || jsonData.content.length === 0) {
      toast.warning("댓글이 비어있거나 잘못된 형식입니다.");
      return;
    }
    try {
      const response = await ForumApi.addComment({
        postId: post.id,
        memberId,
        content: htmlData,
        contentJSON: JSON.stringify(jsonData),
        parentCommentId: replyingTo?.parentCommentId || null,
        opAuthorName: replyingTo?.opAuthorName || null,
        opContent: replyingTo?.opContent || null,
      });
      if (typeof response.contentJSON === "string") {
        try {
          response.contentJSON = JSON.parse(response.contentJSON);
        } catch {
          response.contentJSON = convertHtmlToJson(response.content);
        }
      }
      // 기존 방식: 재조회 후 refreshKey 증가 → 변경: setComments로 바로 업데이트
      const commentData = await ForumApi.getCommentsByPostId(post.id);
      const sortedComments = commentData.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      setComments(sortedComments);
      editor.commands.clearContent();
      setReplyingTo(null);
      toast.success("댓글이 성공적으로 추가되었습니다.");
    } catch (error) {
      console.error("댓글 추가 중 오류:", error);
      toast.error("댓글 추가에 실패했습니다.");
    }
  };

  // 게시글 좋아요 토글 함수
  const handleLikePost = async () => {
    try {
      if (!memberId) await fetchMemberData();
      if (!memberId) return;
      const updatedPost = await ForumApi.toggleLikePost(post.id, memberId);
      setPost((prev) => ({
        ...prev,
        likesCount: updatedPost.totalLikes,
        liked: updatedPost.liked,
      }));
      toast.success("게시글 좋아요 상태가 변경되었습니다.");
    } catch (error) {
      console.error("게시글 좋아요 오류:", error);
      toast.error("좋아요 처리에 실패했습니다.");
    }
  };

  // 댓글 좋아요 토글 함수
  const handleLikeComment = async (commentId) => {
    try {
      if (!memberId) await fetchMemberData();
      if (!memberId) return;
      const updatedComment = await ForumApi.toggleLikeComment(
        commentId,
        memberId
      );
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? {
                ...c,
                likesCount: updatedComment.totalLikes,
                liked: updatedComment.liked,
              }
            : c
        )
      );
      toast.success("댓글 좋아요 상태가 변경되었습니다.");
    } catch (error) {
      console.error("댓글 좋아요 오류:", error);
      toast.error("좋아요 처리에 실패했습니다.");
    }
  };

  // 게시글 제목 인라인 수정 핸들러
  const handleEditTitleClick = () => {
    openModal("editPostTitle", post.id, post.title);
  };

  if (loading) return <div>로딩 중...</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <PostDetailContainer>
      <ReplyQuoteGlobalStyle />
      <GlobalKeyframes />

      {/* (A) 게시글 제목 영역 */}
      <PostTitle>
        {post.hidden ? (
          <HiddenCommentNotice>
            NOTICE: 해당 게시글은 삭제되거나 숨김 처리되었습니다.
          </HiddenCommentNotice>
        ) : (
          <>
            <span>
              {post.title}
              {post.editedTitleByAdmin && (
                <AdminEditIndicator>
                  [관리자에 의해 제목 수정됨]
                </AdminEditIndicator>
              )}
            </span>
            {memberId === post.memberId &&
              !isAdmin &&
              !post.editedByAdminTitle && (
                <EditButton
                  onClick={handleEditTitleClick}
                  aria-label="Edit Title"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </EditButton>
              )}
            {isAdmin &&
              (!post.editedByAdminTitle || memberId !== post.memberId) && (
                <EditButton
                  onClick={handleEditTitleClick}
                  aria-label="Edit Title"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </EditButton>
              )}
            {post.editedByAdminTitle &&
              memberId === post.memberId &&
              !isAdmin && (
                <DisabledEditButton aria-label="Edit Disabled by Admin">
                  <FontAwesomeIcon icon={faEdit} />
                </DisabledEditButton>
              )}
          </>
        )}
      </PostTitle>

      {/* (B) 게시글 정보 + 통일된 날짜/시간 표시 */}
      <div style={{ color: "#777", marginBottom: "1rem" }}>
        생성일: {Commons.formatDateAndTime(post.createdAt)}
      </div>

      {/* (C) 게시글 본문 및 액션 버튼 영역 */}
      <PostBox
        post={post}
        memberId={memberId}
        isAdmin={isAdmin}
        loading={loading}
        onDeletePost={(pid) => openModal("deletePost", pid, "")}
        onEditPostContent={(pid, cJSON) =>
          openModal("editPostContent", pid, cJSON)
        }
        onReportPost={(pid, content) => openModal("reportPost", pid, content)}
        onRestorePost={(pid) => openModal("restorePost", pid, "")}
        onLikePost={handleLikePost}
        onReplyPost={handleReply}
      />

      {/* (D) 가로 구분선: 게시글과 댓글 리스트를 구분 */}
      <Divider />

      {/* (E) 댓글 리스트 영역 */}
      <CommentList
        comments={comments}
        memberId={memberId}
        isAdmin={isAdmin}
        onDeleteComment={(cid) => openModal("deleteComment", cid, "")}
        onEditComment={(cid, cJSON) => openModal("editComment", cid, cJSON)}
        onReportComment={(cid, content) =>
          openModal("reportComment", cid, content)
        }
        onLikeComment={handleLikeComment}
        onReply={handleReply}
        onRestoreComment={(cid) => openModal("restoreComment", cid, "")}
        refreshKey={refreshKey}
      />

      {/* (F) 댓글 입력 영역 */}
      <CommentInput
        editor={editor}
        replyingTo={replyingTo}
        onAddLink={() => openModal("addLink", null, "")}
        onAddComment={handleAddComment}
        onCancelReply={() => setReplyingTo(null)}
      />

      {/* (G) 확인 모달 */}
      <ConfirmationModal
        isOpen={isModalOpen}
        type={modalData.type}
        content={modalData.content}
        message={"진행 하시겠습니까?"}
        onConfirm={handleModalConfirm}
        onCancel={() => setIsModalOpen(false)}
      />

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </PostDetailContainer>
  );
};

export default PostDetail;
