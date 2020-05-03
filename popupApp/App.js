import React, { Component } from "react";
import LoginForm from "./components/loginForm";
import UserProfile from "./components/user-profile";
import Navbar from "./components/navbar";
import MyStickers from "./components/myStickers";
import TaggedStickers from "./components/taggedStickers";
import MyFriends from "./components/friends";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "home",
    };
    this.changePage = this.changePage.bind(this);
  }

  changePage(page) {
    this.setState({ page: page });
  }

  render() {
    switch (this.state.page) {
      case "home":
        return (
          <div>
            <Navbar changePage={this.changePage} />
            <LoginForm changePage={this.changePage} />
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
