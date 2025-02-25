import styled from "styled-components";

const MainContainer = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  background-color: white; /* 원하는 배경색으로 변경 가능 */

  @media (max-width: 768px) {
    top: 72px;
    position: relative;
  }
`;

export default MainContainer;
