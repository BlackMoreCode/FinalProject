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
  AdminEditIndicator,
  EditButton,
  DisabledEditButton,
} from "../style/PostDetailStyles";
import PostBox from "./PostBox";
import CommentsContainer from "./CommentsContainer";
import Commons from "../../../util/Common";
import styled from "styled-components";
import { useSelector } from "react-redux";

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

  // KR: 항상 최상단에서 useEffect를 선언해, 훅이 매 렌더마다 동일한 순서로 호출되도록 합니다.
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

  // KR: 훅을 선언한 뒤에, 로딩 상태와 post가 없을 때의 렌더링을 최종 return 문 안에서 조건부로 처리합니다.

  return (
    <PostDetailContainer>
      <ReplyQuoteGlobalStyle />
      <GlobalKeyframes />

      {/* 조건부 렌더링을 여기에 배치 */}
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
              <span>{post.title}</span>
            )}
          </PostTitle>
          <div style={{ color: "#777", marginBottom: "1rem" }}>
            생성일: {Commons.formatDateAndTime(post.createdAt)}
          </div>

          <PostBox
            post={post}
            memberId={user?.id}
            isAdmin={user?.admin}
            loading={loading}
            // ...other props...
          />

          <Divider />

          {/* 댓글 영역을 별도 컨테이너로 분리한 경우 */}
          <CommentsContainer postId={postId} user={user} />
        </>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </PostDetailContainer>
  );
};

export default PostDetail;
