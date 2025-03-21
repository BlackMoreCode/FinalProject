import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/AxiosInstance";
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
import { useSelector } from "react-redux";
import ProfileApi from "../../api/ProfileApi";
// 리덕스를 추가로 임포트 할 예정

const ProfilePage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // URL에서 id 가져오기
  const [loggedInUserId, setLoggedInUserId] = useState(null); // 로그인한 유저의 ID
  const [isOwnProfile, setIsOwnProfile] = useState(false); // 본인 프로필 여부 체크
  const [isPaidMember, setIsPaidMember] = useState(false); // 맴버십 구매 여부 체크

  const [user, setUser] = useState({
    name: "홍길동",
    introduce: "동에 번쩍 서에 번쩍",
    profileImg: "",
    postsCount: 12,
    likesCount: 25,
  });

  // 실제로는 백엔드에서 fetch하거나 props로 받을 수 있게

  const [customStyle, setCustomStyle] = useState({
    bgColor: "#ffffff",
    nicknameFont: "Arial, sans-serif",
    nicknameSize: "1.5rem",
    introduceFont: "Georgia, serif",
    introduceSize: "1rem",
    nicknameColor: "#000000", // 기본값
    introduceColor: "#000000", // 기본값
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [idResponse, purchaseResponse] = await Promise.all([
          ProfileApi.getLoggedInUserId(),
          ProfileApi.checkMembership(),
        ]);

        const userId = idResponse.data;
        const isPaid = purchaseResponse.data;
        console.log("접속한 유저 Id:" + userId);

        if (userId === null) {
          alert("로그인이 필요한 서비스입니다.");
          navigate("/main");
          return;
        }

        setLoggedInUserId(userId);
        setIsPaidMember(isPaid);
        setIsOwnProfile(id ? id === String(userId) : true);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        alert("로그인이 필요한 서비스입니다.");
        navigate("/main");
      }
    };

    fetchProfileData();
  }, [id, navigate]);

  const handlePaymentClick = () => {
    navigate("/pay"); // 결제 페이지로 이동
  };

  const handleEditClick = () => {
    navigate("/profile/edit");
  };

  const handleCustomClick = () => {
    navigate("/profile/cardcustom");
  };

  return (
    <ProfilePageContainer>
      <ProfilePageHeader>
        <HeaderUp>
          <Profile userId={id || loggedInUserId} customStyle={null} />
          <ProfileButtonContainer>
            {isOwnProfile && (
              <ProfileButton onClick={handleEditClick}>
                <EditIcon />
                <span>프로필 수정</span>
              </ProfileButton>
            )}
            {isOwnProfile && !isPaidMember && (
              <ProfileButton onClick={handlePaymentClick}>
                <span>맴버십 결제하기</span>
              </ProfileButton>
            )}
            {isOwnProfile && isPaidMember && (
              <ProfileButton onClick={handleCustomClick}>
                <span>프로필 디자인</span>
              </ProfileButton>
            )}
          </ProfileButtonContainer>
        </HeaderUp>
        <HeaderDown>
          <UserStats></UserStats>
        </HeaderDown>
      </ProfilePageHeader>
      <ProfileTabs />
    </ProfilePageContainer>
  );
};
export default ProfilePage;
