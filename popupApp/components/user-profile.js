import React, { useState } from "react";
import { Button } from "semantic-ui-react";
import axios from "axios";
import UpdateField from "./updateField";
const ngrokUrl = require("./ngrok");
import getToken from "../../utils/getToken";
import getUser from "../../utils/getUser";

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
      autoLoad: "",
      dailyEmails: "",
    };

    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateUserInfo = this.updateUserInfo.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.openNewTab = this.openNewTab.bind(this);
    this.toggleField = this.toggleField.bind(this);
  }

  async componentDidMount() {
    const userData = await getUser();
    console.log("userData: ", userData);
    this.setState({
      autoLoad: userData.autoLoad,
      dailyEmails: userData.dailyEmails,
    });
  }

  handleEditClick(event) {
    console.log("event", event);
    this.setState({ editField: event.target.id });
  }

  async toggleField(field) {
    //update db, update chrome storage user, send message to background script?, update checkbox status
    console.log("updating field");

    //update chrome storage
    const userData = await getUser();
    if (field === "autoLoad") {
      userData.autoLoad = !userData.autoLoad;
      await chrome.storage.sync.set({ user: userData }, function (result) {
        console.log("value of chrome storage user: ", userData);
      });
    } else if (field === "dailyEmails") {
      userData.dailyEmails = !userData.dailyEmails;
      await chrome.storage.sync.set({ user: userData }, function (result) {
        console.log("value of chrome storage user: ", userData);
      });
    }

    //update db
    const token = await getToken();
    console.log("token: ", token);
    console.log("background token for save");
    const config = {
      headers: {
        Authorization: `bearer ${token}`,
      },
    };
    const response = await axios.put(
      `${ngrokUrl}api/users/toggleSetting/${this.props.user.id}`,
      { toggleField: field },
      config
    );

    //send message to background to adjust autoload listener
    if (field === "autoLoad") {
      if (this.state.autoLoad) {
        await chrome.runtime.sendMessage({
          msg: "deactivateAutoLoad",
        });
      } else {
        await chrome.runtime.sendMessage({
          msg: "activateAutoLoad",
        });
      }
    }

    //update local state to toggle checkbox
    if (field === "autoLoad") {
      this.setState({ autoLoad: !this.state.autoLoad });
    } else if (field === "dailyEmails") {
      this.setState({ dailyEmails: !this.state.dailyEmails });
    }
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
    console.log("response: ", response.request.responseText);

    if (response.request.responseText === "OK") {
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

  handleChange() {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  cancelEdit() {
    this.setState({ editField: null });
  }

  openNewTab(newUrl) {
    chrome.tabs.create({ url: newUrl });
  }

  render() {
    console.log("props: ", this.props);
    const userInfoWrapper = "userInfoWrapper";
    console.log("autoLoad: ", this.props.autoLoad);

    return (
      <div>
        <h1>{this.props.user.userName}'s User Profile</h1>
        <div>
          <div className="sadText">
            {this.state.submitMessage !== "" ? this.state.submitMessage : ""}
          </div>

          <div className="profileOptions">
            <h2>Options: </h2>
            <div className="profileOptions">
              <div className="checkBoxOption">
                <div>Auto-Load Stickers</div>
                <input
                  type="checkbox"
                  label="Auto-Load Stickers"
                  checked={this.state.autoLoad ? "checked" : null}
                  onChange={() => this.toggleField("autoLoad")}
                ></input>
              </div>
              <div className="checkBoxOption">
                <div>Daily New Sticker Emails</div>
                <input
                  type="checkbox"
                  label="Daily New Sticker Emails"
                  checked={this.state.dailyEmails ? "checked" : null}
                  onChange={() => this.toggleField("dailyEmails")}
                ></input>
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
              <div className="columnWrap start">
                <span>Password: </span>
              </div>
              <div className="columnWrap center">
                <span>Hidden</span>
              </div>
              <div className="columnWrap end">
                <Button
                  className="updateButton"
                  onClick={this.handleEditClick}
                  id="password"
                >
                  Edit
                </Button>
              </div>
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
              <div className="columnWrap start">
                <span>Email: </span>
              </div>

              <div className="columnWrap center">
                <span>Hidden</span>
              </div>
              <div className="columnWrap end">
                <Button
                  className="updateButton"
                  onClick={this.handleEditClick}
                  id="newEmail"
                >
                  Edit
                </Button>
              </div>
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
                <div>
                  To change your profile picture, visit{" "}
                  <a
                    href="https://en.gravatar.com/"
                    onClick={() => this.openNewTab("https://en.gravatar.com/")}
                  >
                    gravatar.com
                  </a>
                  , which is where we get a profile picture based on your email
                  address.
                </div>
                {/* <input
                  type="text"
                  label="oldPassword"
                  name="oldPassword"
                  onChange={this.handleChange}
                  value={this.state.oldPassword}
                />
              </div> */}
                {/* <div className="editField">
                <div>New Image Link: </div>
                <input
                  type="text"
                  label="newImageUrl"
                  name="newImageUrl"
                  onChange={this.handleChange}
                  value={this.state.imageUrl}
                />
              </div> */}
                <div className="editFooter">
                  {/* <Button
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
                </Button> */}
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
            </div>
          ) : (
            <div className={userInfoWrapper}>
              <div className="columnWrap start">
                <span>Profile Picture: </span>
              </div>
              <div className="columnWrap center">
                <div className="imageWrapper">
                  <div className="tightWrapper">
                    <img
                      src={`https://www.gravatar.com/avatar/${this.props.user.emailHash}?s=65`}
                      className="profilePic"
                    />
                  </div>
                </div>
              </div>
              <div className="columnWrap end">
                {" "}
                <Button
                  className="updateButton"
                  onClick={this.handleEditClick}
                  id="newImageUrl"
                >
                  Edit
                </Button>
              </div>
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
