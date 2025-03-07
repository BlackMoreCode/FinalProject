import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/AxiosInstance";
import {
  ProfileCard,
  ProfileHeaderContainer,
  ProfileImageWrapper,
  ProfileImage,
  ProfileImagePlaceholder,
  ProfileInfo,
  Nickname,
  Introduce,
} from "./style/ProfileStyle";

// 나중에 유저 id값만 넣으면 알아서 서치 할 수 있도록 하는것이 목적
const Profile = ({ userId, customStyle }) => {
  const [user, setUser] = useState({
    name: "",
    introduce: "",
    profileImg: "",
  });

  const [userStyle, setUserStyle] = useState({
    bgColor: "#ffffff",
    nicknameFont: "Arial, sans-serif",
    nicknameSize: "1.5rem",
    introduceFont: "Georgia, serif",
    introduceSize: "1rem",
    textColorNickname: "#000000", // 기본값
    textColorIntroduce: "#000000", // 기본값
  });

  useEffect(() => {
    console.log("프로필 카드 조회할 유저 ID : ", userId);
    if (userId) {
      // 프로필 데이터와 스타일 가져오기
      console.log("프로필 카드 조회할 유저 ID : ", userId);
      axiosInstance
        .get(`/api/profile/${userId}`)
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

          // 스타일 설정 (없으면 기본값 사용)
          setUserStyle({
            bgColor: bgColor || "#ffffff", // 기본 배경색
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
  }, [userId]);

  return (
    <ProfileCard style={{ backgroundColor: userStyle.bgColor }}>
      <ProfileHeaderContainer>
        <ProfileImageWrapper>
          {user.profileImg ? (
            <ProfileImage
              src={user.profileImg}
              alt={`${user.name} 프로필 이미지`}
            />
          ) : (
            <ProfileImagePlaceholder>이미지 없음</ProfileImagePlaceholder>
          )}
        </ProfileImageWrapper>
        <ProfileInfo>
          <Nickname
            style={{
              fontFamily: userStyle.nicknameFont,
              fontSize: userStyle.nicknameSize,
              color: userStyle.textColorNickname, // 닉네임 글자색 적용
            }}
          >
            {user.name}
          </Nickname>
          <Introduce
            style={{
              fontFamily: userStyle.introduceFont,
              fontSize: userStyle.introduceSize,
              color: userStyle.textColorIntroduce,
            }}
          >
            {user.introduce}
          </Introduce>
        </ProfileInfo>
      </ProfileHeaderContainer>
    </ProfileCard>
  );
};

export default Profile;
