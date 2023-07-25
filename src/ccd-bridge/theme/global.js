import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  /* Box sizing rules */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  html, body {
    height: 100%;
  }
  body{
    background-color: rgba(163, 139, 114, 0.11);
    font-family: Poppins, sans-serif;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }
`;

export default GlobalStyles;
