import axios from "axios";
const ngrokUrl = require("./popupApp/components/ngrok");
import getStickers from "./utils/getStickers";
import getUser from "./utils/getUser";
import getToken from "./utils/getToken";
/* global chrome */
//Listening for the on-load message
chrome.extension.onConnect.addListener(function (port) {
  if (port.name === "loadedURL") {
    port.onMessage.addListener(async (msg) => {
      if (msg.subject === "site ready") {
        console.log("fetching stickers...");
        const stickers = await getStickers(msg.url);
        port.postMessage({
          subject: "sending stickers",
          urlStickers: stickers,
        });
      }
    });
  }
});

//listening for the update-sticker message
chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  console.log("background script receiving message");
  if (request.msg && request.msg === "saveSticker") {
    const user = await getUser();
    const sticker = request.sticker;
    sticker.url = request.URL;
    sticker.user = user;
    sticker.xPos = sticker.left;
    sticker.yPos = sticker.top;
    if (sticker.message === "") {
      sticker.message = "empty";
    }
    const token = await getToken();
    console.log("background token for save");
    const config = {
      headers: {
        Authorization: `bearer ${token}`,
      },
    };
    const stickerResponse = await axios.put(
      `${ngrokUrl}api/stickers/${sticker.id}`,
      {
        sticker,
        user,
      },
      config
    );

    console.log("update sticker response from db: ", stickerResponse);
    return true;
  }

  if (request.msg && request.msg === "deleteSticker") {
    const token = await getToken();
    const config = {
      headers: {
        Authorization: `bearer ${token}`,
      },
    };
    const user = await getUser();
    const { stickerId } = request;
    await axios.delete(
      `${ngrokUrl}api/stickers/${stickerId}/${user.id}`,
      config
    );
    return true;
  }
});
