import styled from "styled-components";
import { FaEdit } from "react-icons/fa";

export const ProfilePageContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 2rem 0;
`;

export const ProfilePageHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
`;

export const ProfileButtonContainer = styled.div`
  display: flex;
  flex-direction: column; /* 버튼을 세로 정렬 */
  align-items: flex-start;
  justify-content: flex-start;
  height: 100%;
  gap: 5px; /* 버튼 간격 추가 */
`;

export const ProfileButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  background-color: #d8bfa7;
  color: #5a3d36;
  border: none;
  border-radius: 5px;
  width: 100%;
  justify-content: center;

  /* 기본 상태: 아이콘 + 텍스트 */
  span {
    display: block;
  }

  /* 모바일에서는 텍스트 숨김 */
  @media (max-width: 768px) {
    span {
      display: none; /* 모바일에서 텍스트 숨기기 */
    }
  }

  &:hover {
    background-color: #9e7c50;
  }
`;

export const EditIcon = styled(FaEdit)`
  font-size: 1.2rem;
`;

export const UserStats = styled.div`
  margin-bottom: 0;
  margin-left: 2rem;
  display: flex;
  flex-direction: column;

  span {
    margin-right: 1rem;
  }
  @media (max-width: 768px) {
    display: block; /* 세로로 나열되게 하기 */
    text-align: left; /* 텍스트 중앙 정렬 */
  }
`;

export const HeaderUp = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const HeaderDown = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;
