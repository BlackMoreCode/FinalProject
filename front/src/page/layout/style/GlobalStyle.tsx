import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Arial', sans-serif;
    background-color: #f4f4f4;
    color: #333;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: normal;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  /* 추가적인 글로벌 스타일을 여기에 작성 */
`;

export default GlobalStyle;
