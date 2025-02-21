import React, { useState } from "react";
import "../../css/ProfileTaps.css";

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState("posts");

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <section className="profile-tabs">
      <nav className="tab-menu">
        <ul>
          <li
            className={activeTab === "posts" ? "active" : ""}
            onClick={() => handleTabChange("posts")}
          >
            작성글
          </li>
          <li
            className={activeTab === "comments" ? "active" : ""}
            onClick={() => handleTabChange("comments")}
          >
            댓글
          </li>
          <li
            className={activeTab === "likes" ? "active" : ""}
            onClick={() => handleTabChange("likes")}
          >
            좋아요
          </li>
        </ul>
      </nav>

      <div className="tab-content">
        {activeTab === "posts" && (
          <div className="posts">
            {/* 게시글 리스트 렌더링 예시 */}
            <article className="user-post">
              <h3>게시글 제목 1</h3>
              <p>게시글 내용 일부 표시...</p>
            </article>
            <article className="user-post">
              <h3>게시글 제목 2</h3>
              <p>게시글 내용 일부 표시...</p>
            </article>
            {/* ... */}
          </div>
        )}

        {activeTab === "comments" && (
          <div className="comments">
            <p>댓글 리스트 예시</p>
            {/* 댓글 리스트 렌더링 */}
          </div>
        )}

        {activeTab === "likes" && (
          <div className="likes">
            <p>좋아요한 글/댓글 리스트 예시</p>
            {/* 좋아요 리스트 렌더링 */}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfileTabs;
