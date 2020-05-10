import React, { Component } from "react";
import { connect } from "react-redux";
//import { me } from "./store";
const LoginForm = require("./components/loginForm");
// const AuthStuff = require("./components/auth-form");
// const { Login } = AuthStuff;
// const { Signup } = AuthStuff;
const MyStickers = require("./components/myStickers");
const TaggedStickers = require("./components/taggedStickers");
const UserProfile = require("./components/user-profile");

export default class Routes extends Component {
  componentDidMount() {
    console.log("component did mount");
    //load initial data
  }

  render() {
    //pull out logged in status from initial data load
    let page = "temp";
    switch (this.state.page) {
      default:
        page = <LoginForm />;
        break;
      //   case "signUp":
      //     page = <Signup />;
      //     break;
      //   case "logIn":
      //     page = <Login />;
      //     break;
      //   case "myStickers":
      //     page = <MyStickers />;
      //     break;
      //   case "taggedStickers":
      //     page = <TaggedStickers />;
      //     break;
      //   case "Profile":
      //     page = <UserProfile />;
      //     break;
      case "Temp":
        page = <LoginForm />;
    }

    return page;
  }
}

// const mapState = (state) => {
//   return {
//     isLoggedIn: true,
//     // isLoggedIn: !!state.user.id,
//   };
// };

// const mapDispatch = (dispatch) => {
//   return {
//     loadInitialData() {
//       dispatch("placeholder for me function");
//     },
//   };
// };

// export default connect(mapState, mapDispatch)(Routes);
