import { createGlobalStyle } from 'styled-components';

export const GlobalCss = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  body {
    -webkit-font-smoothing: antialiased;
  }

  body, input, button {
    font: 16px sans-serif;
  }

  button {
    cursor: pointer;
  }

  :root {
    --white: #ffffff;
  }

  ul, li {
    list-style: none;
  }

  a {
    text-decoration: none;
  }
`;
