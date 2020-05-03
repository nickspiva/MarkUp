import React from "react";
import ReactDOM from "react-dom";
import App from "./popupApp/App.js";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";

ReactDOM.render(
  //<Router>
  <App />,
  //</Router>,
  document.getElementById("app")
);
