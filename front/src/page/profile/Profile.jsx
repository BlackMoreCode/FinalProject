import React from "react";
import {
  ProfileHeaderContainer,
  ProfileImageWrapper,
  ProfileImage,
  ProfileImagePlaceholder,
  ProfileInfo,
  Nickname,
  UserStats,
  Introduce,
} from "./style/ProfileStyle";

const Profile = ({ user }) => {
  return (
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
        <Nickname>{user.name}</Nickname>
        <Introduce>{user.introduce}</Introduce>
      </ProfileInfo>
    </ProfileHeaderContainer>
  );
};

export default Profile;
