import React from "react";
import { Form, Button } from "semantic-ui-react";
import axios from "axios";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    // this.handleClickTwo = this.handleClickTwo.bind(this);
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

  // handleClickTwo() {
  //   this.props.changePage("profile");
  // }

  // addSticker() {
  //   console.log("testing add");
  //   chrome.tabs.executeScript({
  //     file: "addSticker.js",
  //   });
  // }

  // getSticker() {
  //   console.log("in popup, you clicked get sticker");
  //   //get url of current tab
  //   var query = { active: true, currentWindow: true };
  //   let currentTab;
  //   let thisTab;
  //   function getTabs(tabs) {
  //     thisTab = tabs[0];
  //     currentTab = tabs[0].url; // there will be only one in this array
  //     console.log("tabs[0", tabs[0]); // also has properties like currentTab.id
  //     //to send message to current tab has to be within this query
  //     chrome.storage.sync.get(currentTab, function (sticker) {
  //       console.log("retrieved sticker**", sticker[currentTab]);
  //       chrome.tabs.sendMessage(thisTab.id, {
  //         sticker: sticker[currentTab],
  //       });
  //     });
  //   }
  //   chrome.tabs.query(query, getTabs);
  //   //with just currentTab variable gets all saved info? trying brackets, brackets throw error
  // }

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

export default LoginForm;
