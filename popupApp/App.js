import React from "react";
import LoginForm from "./components/loginForm";
import UserProfile from "./components/user-profile";
import Navbar from "./components/navbar";
import MyStickers from "./components/myStickers";
import TaggedStickers from "./components/taggedStickers";
import MyFriends from "./components/friends";
import SignupForm from "./components/signup-form";
import getUser from "../utils/getUser";
import getToken from "../utils/getToken";
import ngrokUrl from "./components/ngrok";
import axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "login",
      user: null,
      loggedIn: false,
    };
    this.changePage = this.changePage.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.logout = this.logout.bind(this);
    this.loggedIn = this.loggedIn.bind(this);
    this.renderPage = this.renderPage.bind(this);
  }

  updateUser(user) {
    this.setState((state) => {
      return { ...state, user };
    });
  }

  loggedIn() {
    this.setState((state) => {
      return { ...state, loggedIn: true };
    });
  }

  async logout() {
    await chrome.storage.sync.remove(["markUp", "user"], function (
      response
    ) {});
    this.setState((state) => {
      return { page: "login", user: null, loggedIn: false };
    });
  }

  async componentDidMount() {
    //Check to see if user is still logged in & valid, and get their data on local state,
    //else clear their data.
    if (!this.state.user) {
      const userData = await getUser();

      if (userData) {
        this.updateUser(userData);
        this.loggedIn();
      }
    }

    //check to see if token has expired
    const token = await getToken();
    //if no token, do nothing
    if (token !== undefined) {
      const config = {
        headers: {
          Authorization: `bearer ${token}`,
        },
      };
      //check w/ server to see if token is still valid
      const response = await axios.get(
        `${ngrokUrl}api/auth/tokenDateCheck`,
        config
      );
      const isCurrent = response.data === "token valid" ? true : false;
      //if the token is expired, removed user info from chrome storage and empty state
      if (!isCurrent) {
        await this.logout();
      }

      if (isCurrent) {
        this.changePage("feed");
      }
    }
  }

  //changes the page to a different page using component state
  changePage(page) {
    this.setState({ page: page });
  }

  //returns as JSX element of the current page (e.g. login page v. my stickers page)
  renderPage() {
    switch (this.state.page) {
      case "login":
        return (
          <LoginForm
            changePage={this.changePage}
            user={this.state.user}
            logout={this.logout}
            updateUser={this.updateUser}
            loggedIn={this.loggedIn}
          />
        );
      case "signup":
        return <SignupForm changePage={this.changePage} />;
      case "profile":
        return (
          <UserProfile changePage={this.changePage} user={this.state.user} />
        );
      case "my stickers":
        return (
          <MyStickers changePage={this.changePage} user={this.state.user} />
        );
      case "feed":
        return (
          <TaggedStickers changePage={this.changePage} user={this.state.user} />
        );
      case "friends":
        return (
          <MyFriends
            changePage={this.changePage}
            user={this.state.user}
            loggedIn={this.state.loggedIn}
          />
        );
      default:
        return <div>Default</div>;
    }
  }

  render() {
    return (
      <div>
        <Navbar
          loggedIn={this.state.loggedIn}
          page={this.state.page}
          changePage={this.changePage}
        />
        <div className="contentArea">{this.renderPage()}</div>
      </div>
    );
  }
}
export default App;
