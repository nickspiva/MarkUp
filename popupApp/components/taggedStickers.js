import React from "react";
import axios from "axios";
import StickerLink from "./stickerLink";
import getToken from "../../utils/getToken";
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
    const friendStickerResponse = await axios.get(
      `${ngrokUrl}api/stickers/friends/${id}`,
      config
    );

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
