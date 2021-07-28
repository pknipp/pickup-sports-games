import React from 'react';
import ReactDOM from 'react-dom';
// import './reset.css';
import './index.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
// import './index.css';
import App from './App';
require("dotenv").config();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
