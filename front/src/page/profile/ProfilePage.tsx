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
    axiosInstance
      .get("/api/profile/getId")
      .then((response) => {
        setLoggedInUserId(response.data); // 로그인한 유저의 ID 설정
        console.log("Response data:", response.data); // 로그인한 유저 ID
      })
      .catch((err) => console.error(err));
  }, []); // 이 useEffect는 로그인된 ID를 가져오는 역할만 합니다.

  useEffect(() => {
    axiosInstance
      .get("/api/purchase/check")
      .then((response) => {
        setIsPaidMember(response.data); // 로그인한 유저의 구매 여부 확인
        console.log("Response data:", response.data); // 참, 거짓 반환
      })
      .catch((err) => console.error(err));
  }, []); // 이 useEffect는 로그인된 유저의 구매 여부만 확인

  useEffect(() => {
    if (id) {
      // URL의 id 값이 있는 경우
      if (id === String(loggedInUserId)) {
        setIsOwnProfile(true); // id와 로그인한 유저 ID가 일치하면 본인 프로필
      } else {
        setIsOwnProfile(false); // id와 로그인한 유저 ID가 일치하지 않으면 다른 유저 프로필
      }
    } else {
      // URL id 값이 없는 경우
      if (loggedInUserId) {
        setIsOwnProfile(true); // loggedInUserId 값이 있다면 본인 프로필
      } else {
        setIsOwnProfile(false); // 로그인된 유저가 없으면 프로필을 못 찾음
      }
    }
  }, [loggedInUserId, id]); // loggedInUserId와 id가 변경될 때마다 실행

  const handlePaymentClick = () => {
    navigate("/pay"); // 결제 페이지로 이동
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
              <ProfileButton onClick={handleCustomClick}>
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
