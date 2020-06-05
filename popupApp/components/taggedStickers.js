import React from "react";
import axios from "axios";
import StickerLink from "./stickerLink";
const ngrokUrl = require("./ngrok");

class TaggedStickers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taggedStickers: [],
      friendStickers: [],
    };
  }

  async componentDidMount() {
    const { id } = this.props.user;
    console.log("id: ", id);
    const atTaggedResponse = await axios.get(
      `${ngrokUrl}api/stickers/tagged/ByFriends/${id}`
    );
    const friendStickerResponse = await axios.get(
      `${ngrokUrl}api/stickers/friends/${id}`
    );
    this.setState((prevState) => {
      return {
        taggedStickers: atTaggedResponse.data,
        friendStickers: friendStickerResponse.data,
      };
    });
  }

  render() {
    console.log("this.state.stickers: ", this.state.stickers);
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
          <div>No Stickers</div>
        )}
        <h2>Friends' Stickers</h2>
        {this.state.friendStickers.length ? (
          <div>
            {this.state.friendStickers.map((sticker) => (
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

export default TaggedStickers;
