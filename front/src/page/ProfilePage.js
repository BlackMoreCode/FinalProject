import React, { useEffect, useState } from "react";
import ProfileHeader from "../component/profile/ProfileHeader";
import ProfileTabs from "../component/profile/ProfileTaps";
import "../css/ProfilePage.css";

const ProfilePage = () => {
  // 실제로는 백엔드에서 fetch하거나 props로 받을 수 있게
  const [user, setUser] = useState({
    name: "홍길동",
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
    <main className="profile-page">
      <ProfileHeader user={user} />
      <ProfileTabs />
    </main>
  );
};

export default ProfilePage;
