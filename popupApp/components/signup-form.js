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
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async handleSubmit() {
    const postUrl = ngrokUrl + "api/users";
    await axios.post(`${postUrl}`, {
      userName: this.state.userName,
      password: this.state.password,
    });
    this.props.changePage("login");
  }

  handleChange() {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    return (
      <React.Fragment>
        {/* <Button onClick={this.addSticker}>Add Sticker</Button>
        <Button onClick={this.getSticker}>Get Sticker</Button> */}
        <h3>Sign-Up</h3>
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
          <Button type="submit">Submit</Button>
        </Form>
      </React.Fragment>
    );
  }
}

export default SignupForm;
