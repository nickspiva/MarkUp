import React from "react";
import ReactDOM from "react-dom";
import App from "./popupApp/App.js";
// import axios from "axios";
// const ngrokUrl = require("./popupApp/components/ngrok");
require("@babel/polyfill");

ReactDOM.render(
  <div>
    <App />
  </div>,
  document.getElementById("app")
);
