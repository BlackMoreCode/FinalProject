import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "./Profile";
import ProfileTabs from "./ProfileTaps";
import {
  ProfilePageContainer,
  ProfilePageHeader,
  ProfileButtonContainer,
  ProfileButton,
  EditIcon,
  UserStats,
  HeaderUp,
  HeaderDown,
} from "./style/ProfilePageStyle";

const ProfilePage = () => {
  const navigate = useNavigate();
  // 실제로는 백엔드에서 fetch하거나 props로 받을 수 있게
  const [user, setUser] = useState({
    name: "홍길동",
    introduce: "동에 번쩍 서에 번쩍",
    profileImg: "",
    postsCount: 12,
    likesCount: 25,
  });

  const [customStyle, setCustomStyle] = useState({
    bgColor: "#ffffff",
    nicknameFont: "Arial, sans-serif",
    nicknameSize: "1.5rem",
    introduceFont: "Georgia, serif",
    introduceSize: "1rem",
  });
  const handleStyleChange = (e) => {
    const { name, value } = e.target;
    setCustomStyle((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    // 예: 페이지 로딩 시 유저 정보 불러오기
    // fetch('/api/user/profile')
    //   .then((res) => res.json())
    //   .then((data) => setUser(data))
    //   .catch((err) => console.error(err));
  }, []);

  const handlePaymentClick = () => {
    navigate("/sandbox"); // 결제 페이지로 이동
  };

  const handleCustomClick = () => {
    navigate("/profile/cardcustom");
  };

  return (
    <ProfilePageContainer>
      <ProfilePageHeader>
        <HeaderUp>
          <Profile user={user} customStyle={customStyle} />
          <ProfileButtonContainer>
            <ProfileButton>
              <EditIcon />
              <span>프로필 수정</span>
            </ProfileButton>
            <ProfileButton onClick={handlePaymentClick}>
              <span>결제하기</span>
            </ProfileButton>
            <ProfileButton onClick={handleCustomClick}>
              <span>프로필 디자인</span>
            </ProfileButton>
          </ProfileButtonContainer>
        </HeaderUp>
        <HeaderDown>
          <UserStats>
            <span>
              게시글 작성수: <strong>{user.postsCount}</strong>
            </span>
            <span>
              받은 추천: <strong>{user.likesCount}</strong>
            </span>
          </UserStats>
        </HeaderDown>
      </ProfilePageHeader>
      <ProfileTabs />
    </ProfilePageContainer>
  );
};
export default ProfilePage;
