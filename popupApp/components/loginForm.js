import React from "react";
import { Form, Button } from "semantic-ui-react";
import axios from "axios";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
      loggedIn: this.props.user,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  async handleSubmit() {
    console.log("username: ", this.state.userName);
    console.log("password: ", this.state.password);
    const ngrokURL = "http://3f28444d.ngrok.io/api/login";
    let response = await axios.post(`${ngrokURL}`, {
      userName: this.state.userName,
      password: this.state.password,
    });
    console.log("response: ", response);
    console.log("userId: ", response.data.id);
    if (response.data) {
      await chrome.storage.sync.set({ user: response.data.id }, function () {
        console.log(`userID saved in local storage: ${response.data.id}`);
      });
      // this.setState({
      //   userName: "",
      //   password: "",
      //   loggedIn: true,
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
    const ngrokURL = "http://990f20a1.ngrok.io/api/users";
    axios.post(`${ngrokURL}`, {
      userName: "Kerri",
      password: "REI",
    });
  }

  componentDidMount() {
    console.log("login mounted");
    console.log("this.props.user: ", this.props.user);
    console.log("this.state.loggedIn: ", this.state.loggedIn);
  }

  render() {
    if (!this.state.loggedIn) {
      return (
        <React.Fragment>
          {/* <Button onClick={this.addSticker}>Add Sticker</Button>
        <Button onClick={this.getSticker}>Get Sticker</Button> */}
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
      return <h1>Logged In! {this.props.user}</h1>;
    }
  }
}

export default LoginForm;
