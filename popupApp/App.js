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
    //Check to see if user is still logged in.
    //To be done: check if the jwt is expired, if so, don't log in.
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
    }
  }

  changePage(page) {
    this.setState({ page: page });
  }

  render() {
    switch (this.state.page) {
      case "login":
        return (
          <div>
            <Navbar
              changePage={this.changePage}
              loggedIn={this.state.loggedIn}
              page={this.state.page}
            />
            <LoginForm
              changePage={this.changePage}
              user={this.state.user}
              logout={this.logout}
              updateUser={this.updateUser}
              loggedIn={this.loggedIn}
            />
          </div>
        );
      case "signup":
        return (
          <div>
            <Navbar
              changePage={this.changePage}
              loggedIn={this.state.loggedIn}
              page={this.state.page}
            />
            <SignupForm changePage={this.changePage} />
          </div>
        );
      case "profile":
        return (
          <div>
            <Navbar
              changePage={this.changePage}
              loggedIn={this.state.loggedIn}
              page={this.state.page}
            />
            <UserProfile changePage={this.changePage} user={this.state.user} />
          </div>
        );
      case "myStickers":
        return (
          <div>
            <Navbar
              changePage={this.changePage}
              loggedIn={this.state.loggedIn}
              page={this.state.page}
            />
            <MyStickers changePage={this.changePage} user={this.state.user} />
          </div>
        );
      case "taggedStickers":
        return (
          <div>
            <Navbar
              changePage={this.changePage}
              loggedIn={this.state.loggedIn}
              page={this.state.page}
            />
            <TaggedStickers
              changePage={this.changePage}
              user={this.state.user}
            />
          </div>
        );
      case "friends":
        return (
          <div>
            <Navbar
              changePage={this.changePage}
              loggedIn={this.state.loggedIn}
              page={this.state.page}
            />
            <MyFriends
              changePage={this.changePage}
              user={this.state.user}
              loggedIn={this.state.loggedIn}
            />
          </div>
        );
      default:
        return (
          <div>
            <Navbar
              loggedIn={this.state.loggedIn}
              page={this.state.page}
              changePage={this.changePage}
            />
            <div>Default</div>
          </div>
        );
    }
  }
}
export default App;
