import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './App';

import { GlobalCss } from './styles/global';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <GlobalCss />
  </React.StrictMode>,
  document.getElementById('root'),
);
