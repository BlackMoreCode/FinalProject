import React from "react";
import "../../css/ProfileHeader.css";

const ProfileHeader = ({ user }) => {
  return (
    <section className="profile-header">
      <div className="profile-image">
        {user.profileImg ? (
          <img src={user.profileImg} alt={`${user.name} 프로필 이미지`} />
        ) : (
          <div className="profile-image-placeholder">이미지 없음</div>
        )}
      </div>
      <div className="profile-info">
        <h2 className="nickname">{user.name}</h2>
        <div className="user-stats">
          <span>
            게시글: <strong>{user.postsCount}</strong>
          </span>
          <span>
            받은 추천: <strong>{user.likesCount}</strong>
          </span>
        </div>
        <div className="calendar-section">
          {/* 실제로는 react-calendar, fullcalendar 등 라이브러리를 활용 가능 */}
          <p>캘린더/출석/이벤트 정보 표시 영역</p>
        </div>
      </div>
      <button className="edit-profile-btn">프로필 편집</button>
    </section>
  );
};

export default ProfileHeader;
