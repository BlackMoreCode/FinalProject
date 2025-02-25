import React, { useEffect, useState } from "react";
import Profile from "./Profile";
import ProfileTabs from "./ProfileTaps";
import {
  ProfilePageContainer,
  ProfilePageHeader,
  ProfileButtonContainer,
  ProfileButton,
  EditIcon,
} from "./style/ProfilePageStyle";

const ProfilePage = () => {
  // 실제로는 백엔드에서 fetch하거나 props로 받을 수 있게
  const [user, setUser] = useState({
    name: "홍길동",
    introduce: "동에 번쩍 서에 번쩍",
    profileImg: "",
    postsCount: 12,
    likesCount: 25,
  });

  useEffect(() => {
    // 예: 페이지 로딩 시 유저 정보 불러오기
    // fetch('/api/user/profile')
    //   .then((res) => res.json())
    //   .then((data) => setUser(data))
    //   .catch((err) => console.error(err));
  }, []);

  return (
    <ProfilePageContainer>
      <ProfilePageHeader>
        <Profile user={user} />
        <ProfileButtonContainer>
          <ProfileButton>
            <EditIcon />
            <span>프로필 편집</span>
          </ProfileButton>
        </ProfileButtonContainer>
      </ProfilePageHeader>
      <ProfileTabs />
    </ProfilePageContainer>
  );
};

export default ProfilePage;
