import styled from "styled-components";

export const ProfileHeaderContainer = styled.section`
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 2rem;
`;

export const ProfileImageWrapper = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
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
`;
