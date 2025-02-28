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

  return (
    <ProfilePageContainer>
      <ProfilePageHeader>
        <HeaderUp>
          <Profile user={user} customStyle={customStyle} />
          <ProfileButtonContainer>
            <ProfileButton>
              <EditIcon />
              <span>프로필 편집</span>
            </ProfileButton>
            <ProfileButton onClick={handlePaymentClick}>
              <span>결제하기</span>
            </ProfileButton>
          </ProfileButtonContainer>
        </HeaderUp>
        <HeaderDown>
          <UserStats>
            <span>
              게시글: <strong>{user.postsCount}</strong>
            </span>
            <span>
              받은 추천: <strong>{user.likesCount}</strong>
            </span>
          </UserStats>
        </HeaderDown>
      </ProfilePageHeader>
      {/* 유저가 스타일 변경할 수 있는 UI */}
      <div>
        <label>
          배경색:
          <input
            type="color"
            name="bgColor"
            value={customStyle.bgColor}
            onChange={handleStyleChange}
          />
        </label>
        <br />
        <label>
          닉네임 폰트:
          <select
            name="nicknameFont"
            value={customStyle.nicknameFont}
            onChange={handleStyleChange}
          >
            <option value="Arial, sans-serif">Arial</option>
            <option value="Courier New, monospace">Courier New</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="Tahoma, sans-serif">Tahoma</option>
          </select>
        </label>
        <label>
          닉네임 폰트 크기:
          <input
            type="range"
            name="nicknameSize" // 수정된 부분
            min="1.0"
            max="2.9"
            step="0.1"
            value={parseFloat(customStyle.nicknameSize)}
            onChange={(e) =>
              setCustomStyle((prev) => ({
                ...prev,
                nicknameSize: `${e.target.value}rem`, // 수정된 부분
              }))
            }
          />
          <input
            type="number"
            value={parseFloat(customStyle.nicknameSize)}
            readOnly
            style={{
              width: "50px",
              marginLeft: "10px",
              textAlign: "center",
              border: "none",
              background: "transparent",
            }}
          />
        </label>
        <br />
        <label>
          소개 폰트:
          <select
            name="introduceFont"
            value={customStyle.introduceFont}
            onChange={handleStyleChange}
          >
            <option value="Arial, sans-serif">Arial</option>
            <option value="Courier New, monospace">Courier New</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="Tahoma, sans-serif">Tahoma</option>
          </select>
        </label>
        <label>
          소개 폰트 크기:
          <input
            type="range"
            name="introduceSize" // 수정된 부분
            min="0.8"
            max="1.5"
            step="0.1"
            value={parseFloat(customStyle.introduceSize)}
            onChange={(e) =>
              setCustomStyle((prev) => ({
                ...prev,
                introduceSize: `${e.target.value}rem`, // 수정된 부분
              }))
            }
          />
          <input
            type="number"
            value={parseFloat(customStyle.introduceSize)}
            readOnly
            style={{
              width: "50px",
              marginLeft: "10px",
              textAlign: "center",
              border: "none",
              background: "transparent",
            }}
          />
        </label>
      </div>
      <ProfileTabs />
    </ProfilePageContainer>
  );
};
export default ProfilePage;
