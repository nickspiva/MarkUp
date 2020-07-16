import React from "react";
import { Form, Button } from "semantic-ui-react";
import axios from "axios";
const ngrokUrl = require("./ngrok");

class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
      email: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async handleSubmit() {
    const postUrl = ngrokUrl + "api/users";
    await axios.post(`${postUrl}`, {
      userName: this.state.userName,
      password: this.state.password,
      email: this.state.email,
    });
    this.props.changePage("login");
  }

  handleChange() {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    let isDisabled = false;
    if (
      !this.state.userName.length ||
      !this.state.password.length ||
      !this.state.email.length
    ) {
      isDisabled = true;
    }
    return (
      <div className="profileOptions lilPad">
        <h3>Sign-Up</h3>
        <div className="botPad">
          <div className="touchOGray">email</div>
          <input
            type="text"
            label="email"
            name="email"
            className="searchLabel"
            value={this.state.email}
            onChange={this.handleChange}
          ></input>
        </div>
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
          Sign-Up!
        </button>
      </div>
    );
  }
}

export default SignupForm;
