import React from "react";
import axios from "axios";
import StickerLink from "./stickerLink";
import getToken from "../../utils/getToken";
const ngrokUrl = require("./ngrok");
import moment from "moment";

class TaggedStickers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taggedStickers: [],
      friendStickers: [],
    };
    this.addSticker = this.addSticker.bind(this);
  }

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
    //get user id, get token, set req config
    const { id } = this.props.user;
    const token = await getToken();
    const config = {
      headers: {
        Authorization: `bearer ${token}`,
      },
    };

    //fetch tagged and generally shared friend stickers
    const atTaggedResponse = await axios.get(
      `${ngrokUrl}api/stickers/tagged/ByFriends/${id}`,
      config
    );
    if (atTaggedResponse.data.length) {
      atTaggedResponse.data.sort((a, b) => {
        if (a.updatedAt < b.updatedAt) {
          return 1;
        } else if (a.updatedAt > b.updatedAt) {
          return -1;
        } else {
          return 0;
        }
      });
    }

    const friendStickerResponse = await axios.get(
      `${ngrokUrl}api/stickers/friends/${id}`,
      config
    );

    if (friendStickerResponse.data.length) {
      friendStickerResponse.data.sort((a, b) => {
        if (a.updatedAt < b.updatedAt) {
          return 1;
        } else if (a.updatedAt > b.updatedAt) {
          return -1;
        } else {
          return 0;
        }
      });
    }

    console.log("atTagged: ", atTaggedResponse);
    console.log("friends: ", friendStickerResponse);

    //add stickers to local state
    this.setState((prevState) => {
      return {
        taggedStickers: atTaggedResponse.data,
        friendStickers: friendStickerResponse.data,
      };
    });
  }

  render() {
    return (
      <div>
        <div id="header">
          <h2>@ Tagged Stickers</h2>
          <h2 id="newSticker" onClick={this.addSticker}>
            + New Sticker
          </h2>
        </div>

        {this.state.taggedStickers.length ? (
          <div>
            {this.state.taggedStickers.map((sticker) => (
              <StickerLink sticker={sticker} key={sticker.id} />
            ))}
          </div>
        ) : (
          <div className="sadText">No Stickers</div>
        )}
        <h2>Friends' Stickers</h2>
        {this.state.friendStickers.length ? (
          <div>
            {this.state.friendStickers.map((sticker) => (
              <StickerLink sticker={sticker} key={sticker.id} />
            ))}
          </div>
        ) : (
          <div className="sadText">No Stickers</div>
        )}
      </div>
    );
  }
}

export default TaggedStickers;
