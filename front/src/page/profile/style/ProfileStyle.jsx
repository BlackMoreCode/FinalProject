import styled from "styled-components";

export const ProfileHeaderContainer = styled.section`
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
`;

export const ProfileImageWrapper = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

export const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ProfileImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: gray;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 0.9rem;
`;

export const ProfileInfo = styled.div`
  flex: 1;
  @media (max-width: 768px) {
    text-align: left;
  }
`;

export const Nickname = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

export const Introduce = styled.p`
  margin-top: 0;
  margin-bottom: 0.5rem;
`;

export const UserStats = styled.div`
  margin-bottom: 0;

  span {
    margin-right: 1rem;
  }
  @media (max-width: 768px) {
    display: block; /* 세로로 나열되게 하기 */
    text-align: left; /* 텍스트 중앙 정렬 */
  }
`;

export const ProfileCard = styled.div`
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: 0.3s ease;
  width: 100%;
  margin: 1rem;
`;
