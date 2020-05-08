import React, { Component } from "react";
import LoginForm from "./components/loginForm";
import UserProfile from "./components/user-profile";
import Navbar from "./components/navbar";
import MyStickers from "./components/myStickers";
import TaggedStickers from "./components/taggedStickers";
import MyFriends from "./components/friends";
import SignupForm from "./components/signup-form";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "login",
      user: null,
    };
    this.changePage = this.changePage.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  // componentDidMount() {
  //   chrome.runtime.sendMessage(
  //     {
  //       message: "CheckUser",
  //     },
  //     function (response) {
  //       if (response.user) {
  //         this.setState((state) => {
  //           return { ...state, user: response.user };
  //         });
  //       }
  //     }
  //   );
  // }
  updateUser(userId) {
    this.setState((state) => {
      return { ...state, user: userId };
    });
  }

  async componentDidMount() {
    console.log("component did mount");
    let promise = new Promise(function (resolve, reject) {
      chrome.storage.sync.get("user", function (user) {
        console.log("retrieved user: ", user);
        resolve(user);
      });
    });
    const userId = await promise;
    this.updateUser(userId);
  }

  changePage(page) {
    this.setState({ page: page });
  }

  render() {
    switch (this.state.page) {
      case "login":
        return (
          <div>
            <Navbar changePage={this.changePage} />
            <LoginForm changePage={this.changePage} user={this.state.user} />
          </div>
        );
      case "signup":
        return (
          <div>
            <Navbar changePage={this.changePage} />
            <SignupForm changePage={this.changePage} />
          </div>
        );
      case "profile":
        return (
          <div>
            <Navbar changePage={this.changePage} />
            <UserProfile changePage={this.changePage} />
          </div>
        );
      case "myStickers":
        return (
          <div>
            <Navbar changePage={this.changePage} />
            <MyStickers changePage={this.changePage} />
          </div>
        );
      case "taggedStickers":
        return (
          <div>
            <Navbar changePage={this.changePage} />
            <TaggedStickers changePage={this.changePage} />
          </div>
        );
      case "friends":
        return (
          <div>
            <Navbar changePage={this.changePage} />
            <MyFriends changePage={this.changePage} />
          </div>
        );
      default:
        return (
          <div>
            <Navbar />
            <div>Default</div>
          </div>
        );
    }
  }
}
export default App;
