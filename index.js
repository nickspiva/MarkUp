import React from "react";
import ReactDOM from "react-dom";
import App from "./popupApp/App.js";
require("@babel/polyfill");

ReactDOM.render(
  <div>
    <App />
  </div>,
  document.getElementById("app")
);
