import React, { useState } from "react";
import {
  ProfileTabsContainer,
  TabMenu,
  TabList,
  TabItem,
  TabContent,
  UserPost,
} from "./style/ProfileTabsStyle";
import MiniCalendar from "../../component/MiniCalendar";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";

const ProfileTabs = () => {
  const myId = useSelector((state) => state.user.id);
  const [activeTab, setActiveTab] = useState("calendar");
  const {id } = useParams();
  const memberId = id ? parseInt(id, 10) : myId
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <ProfileTabsContainer>
      <TabMenu>
        <TabList>
          <TabItem
            className={activeTab === "calendar" ? "active" : ""}
            onClick={() => handleTabChange("calendar")}
          >
            캘린더
          </TabItem>
          <TabItem
            className={activeTab === "posts" ? "active" : ""}
            onClick={() => handleTabChange("posts")}
          >
            작성글
          </TabItem>
          <TabItem
            className={activeTab === "comments" ? "active" : ""}
            onClick={() => handleTabChange("comments")}
          >
            댓글
          </TabItem>
          <TabItem
            className={activeTab === "likes" ? "active" : ""}
            onClick={() => handleTabChange("likes")}
          >
            좋아요
          </TabItem>
        </TabList>
      </TabMenu>

      <TabContent>
        {activeTab === "calendar" && (
            <MiniCalendar memberId={memberId}/>
        )}

        {activeTab === "posts" && (
          <div className="posts">
            <UserPost>
              <h3>게시글 제목 1</h3>
              <p>게시글 내용 일부 표시...</p>
            </UserPost>
            <UserPost>
              <h3>게시글 제목 2</h3>
              <p>게시글 내용 일부 표시...</p>
            </UserPost>
          </div>
        )}

        {activeTab === "comments" && (
          <div className="comments">
            <p>댓글 리스트 예시</p>
          </div>
        )}

        {activeTab === "likes" && (
          <div className="likes">
            <p>좋아요한 글/댓글 리스트 예시</p>
          </div>
        )}
      </TabContent>
    </ProfileTabsContainer>
  );
};

export default ProfileTabs;
