import React from "react";
import { Form, Button } from "semantic-ui-react";
import axios from "axios";

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
    const ngrokURL = "http://6f3ac6a6.ngrok.io/api/users";
    axios.post(`${ngrokURL}`, {});
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
        </Form>
      </React.Fragment>
    );
  }
}

export default SignupForm;
