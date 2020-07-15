const ngrokUrl = require("../popupApp/components/ngrok");
import getUser from "./getUser";
import axios from "axios";
import getToken from "./getToken";

/*
 * Fetch relevant stickers for a user given the url of the page they just loaded.
 * @param {String}, url, The url of the page they just loaded.
 * @return {Array},    , Array of stickers (friends, self, public) for the user at the url.
 */

export default async function getStickers(url) {
  try {
    //fetch user and token
    const user = await getUser();
    if (!user) {
      return [];
    }

    const token = await getToken();
    const config = {
      headers: {
        Authorization: `bearer ${token}`,
      },
    };

    //fetch stickers for user from url
    const urlStickers = await axios.get(
      `${ngrokUrl}api/stickers/url/${encodeURIComponent(url)}/${user.id}`,
      config
    );

    urlStickers.data.forEach((sticker) => {
      if (sticker.userId === user.id) {
        sticker.mine = true;
      } else {
        sticker.mine = false;
      }
    });
    return urlStickers;
  } catch (err) {
    //if the token was expired, log the user out, return empty array of stickers
    if (err.response.data === "token expired") {
      await chrome.storage.sync.remove(["markUp", "user"], function (
        response
      ) {});
    } else {
      console.log("error: ", err);
    }
    return [];
  }
}
