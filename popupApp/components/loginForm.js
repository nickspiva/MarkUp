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
    if (response.data) {
      console.log("response: ", response.data);
      //store user info in chrome storage
      await chrome.storage.sync.set(
        { markUp: response.data.token, user: response.data.user },
        function () {
          console.log("value is set to: ", response.data.token);
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
    console.log("ngrokURL: ", ngrokUrl);

    if (!this.props.user) {
      return (
        <React.Fragment>
          <h3>Log-in</h3>
          <Form onSubmit={this.handleSubmit}>
            <Form.Input
              type="text"
              label="username"
              name="userName"
              value={this.state.userName}
              onChange={this.handleChange}
            />
            <Form.Input
              type="password"
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
          <h1>Logged in as: {this.props.user.userName}</h1>
          <Button onClick={this.props.logout}>Logout</Button>
        </div>
      );
    }
  }
}

export default LoginForm;
