import React from "react";
import { Form, Button } from "semantic-ui-react";
import axios from "axios";
const ngrokUrl = require("./ngrok");

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async handleSubmit() {
    //Checks to see if the username/password match the database.
    //If so, saves userinfo in chrome storage & updates app state w/ user info
    const loginURL = ngrokUrl + "api/login";
    let response = await axios.post(`${loginURL}`, {
      userName: this.state.userName,
      password: this.state.password,
    });
    console.log("response: ", response);
    if (response.data && response.data !== "wrong password") {
      console.log("response: ", response.data);
      //store user info in chrome storage
      await chrome.storage.sync.set(
        { markUp: response.data.token, user: response.data.user },
        function (result) {
          console.log("value of chrome storage: ", result);
        }
      );
      //add logged in status to app state
      this.props.loggedIn();
      //add user to app state
      await this.props.updateUser(response.data.user);
      //clear form
      this.setState((prevState) => {
        return { userName: "", password: "" };
      });
    }
  }

  handleChange() {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    // // console.log("this.props.user.email", this.props.user.email);
    // console.log("this.props.user.email", this.props.user.emailHash);
    let isDisabled = false;
    if (!this.state.userName.length || !this.state.password.length) {
      isDisabled = true;
    }
    if (!this.props.user) {
      return (
        <div className="profileOptions lilPad">
          <h3>Log-In</h3>
          <div className="botPad">
            <div className="touchOGray">username</div>
            <input
              type="text"
              label="username"
              name="userName"
              className="searchLabel"
              value={this.state.userName}
              onChange={this.handleChange}
            ></input>
          </div>
          <div className="botPad">
            <div className="touchOGray">password</div>
            <input
              type="password"
              label="password"
              name="password"
              className="searchLabel"
              value={this.state.password}
              onChange={this.handleChange}
            ></input>
          </div>
          <button
            onClick={this.handleSubmit}
            className="signUp"
            disabled={isDisabled}
          >
            Log-In!
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <div className="wrapper">
            <h1>Logged in as: {this.props.user.userName}</h1>
            <div className="imageWrapper">
              <div className="tightWrapper padded">
                <img
                  src={`https://www.gravatar.com/avatar/${this.props.user.emailHash}?s=65`}
                  className="profilePic bordered"
                />
              </div>
            </div>
          </div>
          {/* 
          <img
            src={`https://www.gravatar.com/avatar/${this.props.user.emailHash}`}
          /> */}
          <Button onClick={this.props.logout} className="updateButton">
            Logout
          </Button>
        </div>
      );
    }
  }
}

export default LoginForm;
