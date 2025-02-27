import React from "react";
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

const Profile = ({ user, customStyle }) => {
  return (
    <ProfileCard style={{ backgroundColor: customStyle.bgColor }}>
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
              fontFamily: customStyle.nicknameFont,
              fontSize: customStyle.nicknameSize,
            }}
          >
            {user.name}
          </Nickname>
          <Introduce
            style={{
              fontFamily: customStyle.introduceFont,
              fontSize: customStyle.introduceSize,
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
