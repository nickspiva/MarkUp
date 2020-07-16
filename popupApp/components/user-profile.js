import React, { useState } from "react";
import { Button } from "semantic-ui-react";
import axios from "axios";
import UpdateField from "./updateField";
const ngrokUrl = require("./ngrok");

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitMessage: "",
      editField: null,
      newUserName: "",
      newPassword: "",
      oldPassword: "",
      newEmail: "",
      newImageUrl: "",
    };
    this.handleDoneClick = this.handleDoneClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleUpdateUserName = this.handleUpdateUserName.bind(this);
    this.handleUpdatePassword = this.handleUpdatePassword.bind(this);
    this.updateUserInfo = this.updateUserInfo.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
  }

  handleEditClick(event) {
    console.log("event", event);
    this.setState({ editField: event.target.id });
  }

  async updateUserInfo(updateField, oldPassword, newFieldContent) {
    console.log("type: ", updateField);
    console.log("old password: ", oldPassword);
    console.log("new thing: ", newFieldContent);

    const request = {
      userName: this.props.user.userName,
      password: oldPassword,
      updateField,
      newFieldContent,
    };

    const response = await axios.put(`${ngrokUrl}api/users`, request);
    console.log("response: ", response.request);

    if ((response.request.responseText = "OK")) {
      this.setState({
        submitMessage: "Profile Updated!",
        editField: null,
        newUserName: "",
        newPassword: "",
        oldPassword: "",
        newEmail: "",
      });
    } else {
      this.setState({
        submitMessage: "Update Failed!",
        editField: null,
        newUserName: "",
        newPassword: "",
        oldPassword: "",
        newEmail: "",
      });
    }
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

  cancelEdit() {
    this.setState({ editField: null });
  }

  handleUpdatePassword(newPassword) {
    console.log("update password: ", newPassword);
  }

  handleUpdateUserName(newUserName) {
    console.log("update username: ", newUserName);
  }

  render() {
    console.log("props: ", this.props);
    const userInfoWrapper = "userInfoWrapper";

    //max edit one field at a time
    //state: editing?, fieldToEdit?, errorMessage?
    console.log("editField: ", this.state.editField);
    return (
      <div>
        <h1>{this.props.user.userName}'s User Profile</h1>
        <div>
          {this.state.submitMessage !== "" ? this.state.submitMessage : ""}
          <div className="profileOptions">
            <h2>Options: </h2>
            <div className="profileOptions">
              <div className="checkBoxOption">
                <div>Auto-Load Stickers</div>
                <input type="checkbox" label="Auto-Load Stickers"></input>
              </div>
              <div className="checkBoxOption">
                <div>Daily New Sticker Emails</div>
                <input type="checkbox" label="Daily New Sticker Emails"></input>
              </div>
            </div>
          </div>
          <h2>User Info: </h2>
          {this.state.editField === "password" ? (
            <div className="activeEditWrapper">
              <div class="editHeader">
                <div>Change Password</div>
              </div>
              <div class="editField">
                <div>Old Password:</div>
                <input
                  type="text"
                  label="oldPassword"
                  name="oldPassword"
                  onChange={this.handleChange}
                  value={this.state.oldPassword}
                />
              </div>
              <div class="editField">
                <div>New Password:</div>
                <input
                  type="text"
                  label="newPassword"
                  name="newPassword"
                  onChange={this.handleChange}
                  value={this.state.newPassword}
                />
              </div>
              <div class="editFooter">
                <Button
                  className="updateButton"
                  onClick={() =>
                    this.updateUserInfo(
                      "password",
                      this.state.oldPassword,
                      this.state.newPassword
                    )
                  }
                  id="password"
                >
                  Update
                </Button>
                <Button
                  className="cancelButton"
                  onClick={() => {
                    this.setState({ editField: null });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className={userInfoWrapper}>
              <div>Password: </div>
              <div>
                <span>Hidden</span>
              </div>
              <Button
                className="updateButton"
                onClick={this.handleEditClick}
                id="password"
              >
                Edit
              </Button>
            </div>
          )}
        </div>
        <div>
          {this.state.editField === "newEmail" ? (
            <div className="activeEditWrapper">
              <div class="editHeader">
                <div>Change Email</div>
              </div>
              <div class="editField">
                <div>Current Password:</div>
                <input
                  type="text"
                  label="oldPassword"
                  name="oldPassword"
                  onChange={this.handleChange}
                  value={this.state.oldPassword}
                />
              </div>
              <div class="editField">
                <div>New Email:</div>
                <input
                  type="text"
                  label="newEmail"
                  name="newEmail"
                  onChange={this.handleChange}
                  value={this.state.newEmail}
                />
              </div>
              <div class="editFooter">
                <Button
                  className="updateButton"
                  onClick={() =>
                    this.updateUserInfo(
                      "email",
                      this.state.oldPassword,
                      this.state.newEmail
                    )
                  }
                  id="newEmail"
                >
                  Update
                </Button>
                <Button
                  className="cancelButton"
                  onClick={() => {
                    this.setState({ editField: null });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className={userInfoWrapper}>
              <div>Current Email: </div>
              <div>
                <span>Hidden</span>
              </div>
              <Button
                className="updateButton"
                onClick={this.handleEditClick}
                id="newEmail"
              >
                Edit
              </Button>
            </div>
          )}
        </div>
        <div>
          {this.state.editField === "newImageUrl" ? (
            <div className="activeEditWrapper">
              <div className="editHeader">
                <div>Change Image</div>
              </div>
              <div className="editField">
                <div>Current Password:</div>
                <input
                  type="text"
                  label="oldPassword"
                  name="oldPassword"
                  onChange={this.handleChange}
                  value={this.state.oldPassword}
                />
              </div>
              <div className="editField">
                <div>New Image Link: </div>
                <input
                  type="text"
                  label="newImageUrl"
                  name="newImageUrl"
                  onChange={this.handleChange}
                  value={this.state.imageUrl}
                />
              </div>
              <div className="editFooter">
                <Button
                  onClick={() =>
                    this.updateUserInfo(
                      "imageUrl",
                      this.state.oldPassword,
                      this.state.newImageUrl
                    )
                  }
                  id="newImageUrl"
                >
                  Update
                </Button>
                <Button
                  className="cancelButton"
                  onClick={() => {
                    this.setState({ editField: null });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className={userInfoWrapper}>
              <div>Current imageUrl: </div>
              <div>
                <span>Hidden</span>
              </div>
              <Button
                className="updateButton"
                onClick={this.handleEditClick}
                id="newImageUrl"
              >
                Edit
              </Button>
            </div>
          )}
          {/* <div>Image URL: {this.props.user.imageUrl}</div>
          <Button onClick={this.handleEditClick}>Edit</Button> */}
        </div>
        {/* <img src={this.props.user.imageUrl} alt="user profile img"></img> */}
      </div>
    );
  }
}

export default UserProfile;
