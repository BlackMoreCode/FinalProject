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
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import UserRecipesList from "./recipeLists/UserRecipeList";
import UserPostList from "./post/UserPostList";

const ProfileTabs = () => {
  const myId = useSelector((state) => state.user.id);
  const [activeTab, setActiveTab] = useState("calendar");
  const { id } = useParams();
  const memberId = id ? parseInt(id, 10) : myId;
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
            className={activeTab === "recipe" ? "active" : ""}
            onClick={() => handleTabChange("recipe")}
          >
            작성 레시피
          </TabItem>
        </TabList>
      </TabMenu>

      <TabContent>
        {activeTab === "calendar" && <MiniCalendar memberId={memberId} />}

        {activeTab === "posts" && (
          <div className="posts">
            <UserPostList memberId={memberId} />
          </div>
        )}

        {activeTab === "recipe" && (
          <div className="recipe">
            <UserRecipesList memberId={memberId} />
          </div>
        )}
      </TabContent>
    </ProfileTabsContainer>
  );
};

export default ProfileTabs;
