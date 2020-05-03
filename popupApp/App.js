import React, { Component } from "react";
import LoginForm from "./components/loginForm";
import UserProfile from "./components/user-profile";

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
        return <LoginForm changePage={this.changePage} />;
      case "profile":
        return <UserProfile changePage={this.changePage} />;
      default:
        return <div>Default</div>;
    }
  }
}
export default App;
