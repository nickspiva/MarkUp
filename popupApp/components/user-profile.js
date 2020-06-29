import React, { useState } from "react";
import { Button } from "semantic-ui-react";
import axios from "axios";
const ngrokUrl = require("./ngrok");

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitMessage: null,
      editField: null,
      newUserName: "",
      newPassword: "",
    };
    this.handleDoneClick = this.handleDoneClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleUpdateUserName = this.handleUpdateUserName.bind(this);
    this.handleUpdatePassword = this.handleUpdatePassword.bind(this);
  }

  handleEditClick(event) {
    console.log("event", event);
    this.setState({ editField: event.target.id });
  }

  handleDoneClick(event) {
    if (event.target.id === "userName") {
      this.handleUpdateUserName(this.state.newUserName);
    }

    if (event.target.id === "password") {
      this.handleUpdatePassword(this.state.newPassword);
    }
    this.setState({ editField: null });
  }

  handleChange() {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleUpdatePassword(newPassword) {
    console.log("update password: ", newPassword);
  }

  handleUpdateUserName(newUserName) {
    console.log("update username: ", newUserName);
  }

  render() {
    console.log("props: ", this.props);

    //max edit one field at a time
    //state: editing?, fieldToEdit?, errorMessage?
    console.log("editField: ", this.state.editField);
    return (
      <div>
        <h2>User Profile</h2>
        <div>
          <div>Username: </div>
          {this.state.editField === "userName" ? (
            <div>
              <input
                type="text"
                label="userName"
                name="newUserName"
                onChange={this.handleChange}
                value={this.state.newUserName}
              />
              <Button onClick={this.handleDoneClick} id="userName">
                Update
              </Button>
              <Button
                onClick={() => {
                  this.setState({ editField: null });
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div>
              <div>{this.props.user.userName}</div>
              <Button onClick={this.handleEditClick} id="userName">
                Edit
              </Button>
            </div>
          )}
        </div>
        <div>
          <div>Password: hidden</div>
          <Button onClick={this.handleEditClick}>Edit</Button>
        </div>
      </div>
    );
  }
}

export default UserProfile;
