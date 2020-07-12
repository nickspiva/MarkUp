import React from "react";
import { Button } from "semantic-ui-react";
import axios from "axios";
import StickerLink from "./stickerLink";
import getUser from "../../utils/getUser";
import getToken from "../../utils/getToken";
const ngrokUrl = require("./ngrok");

const getSticker = function () {
  console.log("in popup, you clicked get sticker");
  //get url of current tab
  var query = { active: true, currentWindow: true };
  let currentTab;
  let thisTab;
  function getTabs(tabs) {
    thisTab = tabs[0];
    currentTab = tabs[0].url; // there will be only one in this array
    console.log("tabs[0", tabs[0]); // also has properties like currentTab.id
    //to send message to current tab has to be within this query
    chrome.storage.sync.get(currentTab, function (sticker) {
      console.log("retrieved sticker**", sticker[currentTab]);
      chrome.tabs.sendMessage(thisTab.id, {
        sticker: sticker[currentTab],
      });
    });
  }
  chrome.tabs.query(query, getTabs);
  //with just currentTab variable gets all saved info? trying brackets, brackets throw error
};

class MyStickers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stickers: [],
    };
    this.addSticker = this.addSticker.bind(this);
  }

  async addSticker() {
    const query = { active: true, currentWindow: true };
    const returnUrl = async (tabs) => {
      const currentTab = tabs[0];
      const defaultSticker = {
        message: "default sticker",
        height: "200px",
        width: "200px",
        xPos: "200px",
        yPos: "200px",
        url: currentTab.url,
        user: this.props.user,
      };
      const token = await getToken();
      console.log("token: ", token);
      console.log("sticker: ", defaultSticker);
      console.log("user: ", this.props.user);
      const config = {
        headers: {
          Authorization: `bearer ${token}`,
        },
      };
      const dbSticker = await axios.post(
        `${ngrokUrl}api/stickers/`,
        defaultSticker,
        config
      );
      dbSticker.data.mine = true;
      console.log("db sticker: ", dbSticker);
      console.log("default sticker: ", defaultSticker);
      chrome.tabs.sendMessage(currentTab.id, {
        subject: "adding new sticker",
        sticker: dbSticker,
      });
    };

    chrome.tabs.query(query, returnUrl);

    //create new sticker in db

    //send message with new sticker to content script
  }

  async componentDidMount() {
    const { id } = this.props.user;
    console.log("this.props.user: ", this.props.user);
    const token = await getToken();
    const config = {
      headers: {
        Authorization: `bearer ${token}`,
      },
    };
    let response = await axios.get(`${ngrokUrl}api/stickers/${id}`, config);
    this.setState((prevState) => {
      return { stickers: response.data };
    });
  }

  render() {
    return (
      <div>
        <h2>My Stickers</h2>
        <Button onClick={this.addSticker}>Add Sticker</Button>
        <Button onClick={getSticker}>Get Sticker</Button>
        {this.state.stickers.length ? (
          <div>
            {this.state.stickers.map((sticker) => (
              <StickerLink sticker={sticker} key={sticker.id} />
            ))}
          </div>
        ) : (
          <div>No Stickers</div>
        )}
      </div>
    );
  }
}

export default MyStickers;
