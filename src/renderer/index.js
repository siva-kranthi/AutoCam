import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "antd/dist/antd.dark.css";
import "./assets/css/main.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("app")
);

if (module.hot) {
  module.hot.accept();
}
