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
        <h2>@ Tagged Stickers</h2>
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
