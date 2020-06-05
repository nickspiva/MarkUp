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
      loggedIn: this.props.loggedIn,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  async handleSubmit() {
    //Checks to see if the username/password match the database.
    //If so, saves userinfo in chrome storage & updates app state w/ user info
    const loginURL = ngrokUrl + "api/login";
    let response = await axios.post(`${loginURL}`, {
      userName: this.state.userName,
      password: this.state.password,
    });
    if (response.data) {
      await chrome.storage.sync.set({ user: response.data }, function () {});
      this.props.loggedIn();
      await this.props.updateUser(response.data);
      //new
      // this.setState((prevState) => {
      //   return { userName: "", password: "", loggedIn: true };
      // });
    }
  }

  handleChange() {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleClick() {
    console.log("clicked button");
    const ngrokURL = "http://acae84e8.ngrok.io/api/users";
    axios.post(`${ngrokURL}`, {
      userName: "Kerri",
      password: "REI",
    });
  }

  render() {
    if (!this.props.user) {
      return (
        <React.Fragment>
          <Form onSubmit={this.handleSubmit}>
            <Form.Input
              type="text"
              label="username"
              name="userName"
              value={this.state.userName}
              onChange={this.handleChange}
            />
            <Form.Input
              type="text"
              label="password"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
            <Form.Input type="submit" value="Submit" />
          </Form>
        </React.Fragment>
      );
    } else {
      return (
        <div>
          <h1>Logged In! {this.props.user.userName}</h1>
          <Button onClick={this.props.logout}>Logout</Button>
        </div>
      );
    }
  }
}

export default LoginForm;
