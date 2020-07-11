import React, { Component } from "react";
import LoginForm from "./components/loginForm";
import UserProfile from "./components/user-profile";
import Navbar from "./components/navbar";
import MyStickers from "./components/myStickers";
import TaggedStickers from "./components/taggedStickers";
import MyFriends from "./components/friends";
import SignupForm from "./components/signup-form";
import axios from "axios";
const ngrokUrl = require("./components/ngrok");

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
    //Removes userdata from local storage & sets local app state for user to null
    await chrome.storage.sync.remove(["markUp", "user"], function (
      response
    ) {});
    this.setState((state) => {
      return { page: "login", user: null, loggedIn: false };
    });
  }

  async componentDidMount() {
    console.log("mounting");
    //Checks to see if the user has already logged in recently, if so...
    //Grabs their info from chrome storage and sets it on popup local state
    if (!this.state.user) {
      console.log("no user on state, check sync storage");
      let promise = new Promise(function (resolve, reject) {
        chrome.storage.sync.get(["markUp", "user"], function (data) {
          console.log("component mount data: ", data);
          resolve(data);
        });
      });
      const fulfilledPromise = await promise;
      const token = fulfilledPromise.markUp;
      console.log("token: ", token);
      const userData = fulfilledPromise.user;
      console.log("userData from sync: ", userData);

      if (user) {
        this.updateUser(userData);
        this.loggedIn();
      }
    }

    //if there is a user on state, bind it to a variable
    const user = this.state.user;

    chrome.runtime.onMessage.addListener(async function (
      req,
      res,
      sendResponse
    ) {
      console.log("in component did mount message inc");
      console.log("user in message passing: ", user);
      if (req.msg === "passing saved sticker to popup") {
        const sticker = req.sticker;
        sticker.url = req.website;
        sticker.user = user;
        sticker.xPos = sticker.left;
        sticker.yPos = sticker.top;
        console.log("comp mount req.sticker: ", req.sticker);
        const stickerResponse = await axios.post(
          `${ngrokUrl}api/stickers/`,
          sticker
        );
        console.log("sending sticker response: ", stickerResponse);
        // chrome.tabs.query({ active: true, currentWindow: true }, function (
        //   tabs
        // ) {
        //   chrome.tabs.sendMessage(
        //     tabs[0].id,
        //     { msg: "sending updated sticker back", sticker: stickerResponse },
        //     function (response) {
        //       console.log("response received");
        //     }
        //   );
        // });
        sendResponse({
          msg: "got info on stickers",
          sticker: "testing empty sticker",
        });
        return true;
      }
      return true;
    });
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
