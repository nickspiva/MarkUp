import React from "react";
import { connect } from "react-redux";
import { Button } from "semantic-ui-react";
import axios from "axios";
import StickerLink from "./stickerLink";
const ngrokUrl = require("./ngrok");

const addSticker = function () {
  console.log("testing add");
  chrome.tabs.executeScript({
    file: "addSticker.js",
  });
};

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
  }

  async componentDidMount() {
    console.log("this.props: ", this.props);
    const { id } = this.props.user;
    let response = await axios.get(`${ngrokUrl}api/stickers/${id}`);
    console.log("response: ", response);
    this.setState((prevState) => {
      return { stickers: response.data };
    });
  }

  render() {
    console.log("this.state.stickers: ", this.state.stickers);
    return (
      <div>
        <h2>My Stickers</h2>
        <Button onClick={addSticker}>Add Sticker</Button>
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
