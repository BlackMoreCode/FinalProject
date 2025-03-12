import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/AxiosInstance";
import ProfileStyleCustomizer from "./ProfileStyleCustomizer";
import Profile from "../Profile";
import {
  CustomizationPageContainer,
  CustomizationPageTitle,
  SaveButton,
  ProfileContainer,
} from "./CustomStyle";

const ProfileCustomization = () => {
  const navigate = useNavigate();
  const [loggedInUserId, setLoggedInUserId] = useState(null); // 로그인한 유저의 ID

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
    textColorNickname: "#000000", // 닉네임 글자색 기본값
    textColorIntroduce: "#000000", // 소개 글자색 기본값
  });

  // 로그인된 유저 ID 가져오기
  useEffect(() => {
    axiosInstance
      .get("/api/profile/getId")
      .then((response) => {
        setLoggedInUserId(response.data); // 로그인한 유저의 ID 설정
      })
      .catch((err) => console.error(err));
  }, []);

  // 로그인된 유저의 커스텀 스타일을 DB에서 가져오기
  useEffect(() => {
    if (loggedInUserId) {
      axiosInstance
        .get(`/api/profile/${loggedInUserId}`)
        .then((response) => {
          const {
            nickName,
            memberImg,
            introduce,
            bgColor,
            nicknameFont,
            nicknameSize,
            introduceFont,
            introduceSize,
            textColorNickname,
            textColorIntroduce,
          } = response.data;

          // 유저 데이터 설정
          setUser({
            name: nickName,
            introduce: introduce,
            profileImg: memberImg,
          });

          // 스타일 데이터 설정
          setCustomStyle({
            bgColor: bgColor || "#ffffff", // 기본값 설정
            nicknameFont: nicknameFont || "Arial, sans-serif",
            nicknameSize: nicknameSize || "1.5rem",
            introduceFont: introduceFont || "Georgia, serif",
            introduceSize: introduceSize || "1rem",
            textColorNickname: textColorNickname || "#000000", // 기본값
            textColorIntroduce: textColorIntroduce || "#000000", // 기본값
          });
        })
        .catch((err) => console.error(err));
    }
  }, [loggedInUserId]);

  // 스타일 저장
  const handleSave = async () => {
    try {
      await axiosInstance.put("/api/profile/style", customStyle);
      alert("스타일이 성공적으로 저장되었습니다.");
      navigate("/profile"); // 저장 후 프로필 페이지로 이동
    } catch (error) {
      console.error("스타일 저장 중 오류 발생:", error);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <CustomizationPageContainer>
      <CustomizationPageTitle>프로필 디자인 변경</CustomizationPageTitle>

      <ProfileContainer>
        <Profile userId={loggedInUserId} customStyle={customStyle} />
      </ProfileContainer>

      {/* 스타일 커스터마이저에 커스텀 스타일 전달 */}
      <ProfileStyleCustomizer
        initialStyle={customStyle} // DB에서 가져온 커스텀 스타일을 초기값으로 전달
        onChange={setCustomStyle} // 스타일 변경 시 업데이트
      />

      <SaveButton onClick={handleSave}>저장 후 돌아가기</SaveButton>
    </CustomizationPageContainer>
  );
};

export default ProfileCustomization;
