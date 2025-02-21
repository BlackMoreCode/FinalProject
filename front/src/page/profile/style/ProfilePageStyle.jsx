import styled from "styled-components";

export const ProfilePageContainer = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 2rem 0;
`;

export const ProfilePageHeader = styled.div`
  display: flex;
  justify-content: space-between;
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
`;
