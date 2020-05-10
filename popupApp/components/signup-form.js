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
    this.handleClick = this.handleClick.bind(this);
  }

  handleSubmit() {
    console.log("username: ", this.state.userName);
    console.log("username: ", this.state.password);
    const postUrl = ngrokUrl + "api/users";
    axios.post(`${postUrl}`, {
      userName: this.state.userName,
      password: this.state.password,
    });
  }

  handleChange() {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleClick() {
    console.log("clicked button");
    const postUrl = ngrokUrl + "api/users";
    axios.post(`${postUrl}`, {
      userName: "Kerri",
      password: "REI",
    });
  }

  render() {
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
          <Button type="submit">Submit</Button>
        </Form>
      </React.Fragment>
    );
  }
}

export default SignupForm;
