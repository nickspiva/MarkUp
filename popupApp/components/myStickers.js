import React from "react";
import { Button } from "semantic-ui-react";
import axios from "axios";
import StickerLinkPersonal from "./stickerLinkPersonal";
import getUser from "../../utils/getUser";
import getToken from "../../utils/getToken";
const ngrokUrl = require("./ngrok");

class MyStickers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stickers: [],
    };
    this.addSticker = this.addSticker.bind(this);
  }

  //adds a default sticker to the webpage
  async addSticker() {
    //sets up the query to fetch the current url
    const query = { active: true, currentWindow: true };

    //sets up the callback function to process result of the query,
    //aka build the sticker
    const returnUrl = async (tabs) => {
      const currentTab = tabs[0];
      //build a basic sticker with the url and user set
      const defaultSticker = {
        message: "default sticker",
        height: "200px",
        width: "200px",
        xPos: "200px",
        yPos: "200px",
        url: currentTab.url,
        user: this.props.user,
      };
      //fetches the user's token
      const token = await getToken();
      const config = {
        headers: {
          Authorization: `bearer ${token}`,
        },
      };
      //sends the default sticker to the database (to get the id)
      const dbSticker = await axios.post(
        `${ngrokUrl}api/stickers/`,
        defaultSticker,
        config
      );
      //set's it as belonging to the user
      dbSticker.data.mine = true;
      //sends message to the content script for processing the new sticker
      chrome.tabs.sendMessage(currentTab.id, {
        subject: "adding new sticker",
        sticker: dbSticker,
      });
    };

    chrome.tabs.query(query, returnUrl);
  }

  async componentDidMount() {
    //gets userId, and token
    const { id } = this.props.user;
    const token = await getToken();
    const config = {
      headers: {
        Authorization: `bearer ${token}`,
      },
    };
    //sends request to server for all this user's stickers
    let response = await axios.get(`${ngrokUrl}api/stickers/${id}`, config);
    let stickers = response.data;
    console.log("stickers: ", stickers);
    if (stickers.length) {
      stickers = stickers.sort((a, b) => {
        if (a.updatedAt < b.updatedAt) {
          return 1;
        } else if (a.updatedAt > b.updatedAt) {
          return -1;
        } else {
          return 0;
        }
      });
    }

    console.log("stickers sorted: ", stickers);
    //updates state with stickers from server
    this.setState((prevState) => {
      return { stickers };
    });
  }

  render() {
    console.log("this.state.stickers[0]", this.state.stickers[0]);
    return (
      <div>
        <div id="header">
          <h2>My Stickers</h2>
          <h2 id="newSticker" onClick={this.addSticker}>
            + New Sticker
          </h2>
        </div>
        {/* if there are stickers render them */}
        {this.state.stickers.length ? (
          <div>
            {this.state.stickers.map((sticker) => (
              <StickerLinkPersonal sticker={sticker} key={sticker.id} />
            ))}
          </div>
        ) : (
          // if not, display a message indicating no sticker
          <div className="sadText">No Stickers</div>
        )}
      </div>
    );
  }
}

export default MyStickers;
