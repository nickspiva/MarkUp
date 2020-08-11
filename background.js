import axios from "axios";
const ngrokUrl = require("./popupApp/components/ngrok");
import getStickers from "./utils/getStickers";
import getUser from "./utils/getUser";
import getToken from "./utils/getToken";
/* global chrome */
//Listening for the on-load message

//on log-in in the app, fetching the user info
//depending on the db user info, set the auto-load status
//on toggling the auto-load status, update in the db,
//update local state
//and send message to the background to add the listener

// let promise = new Promise(function (resolve, reject) {
//   chrome.storage.sync.get("autoLoad", function (token) {
//     resolve(token);
//   });
// });
// const fulfilledPromise = await promise;
// console.log("fulfilledPromise: ", fulfilledPromise);

//if setting is set to autoLoad, then add the listener,
//otherwise don't add the listener
const loadListener = async function (port) {
  if (port.name === "loadedURL") {
    //if receiving a message that the site is loaded
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
};

const bootUp = async () => {
  const user = await getUser();
  if (user.autoLoad) {
    console.log("adding listener");
    chrome.extension.onConnect.addListener(loadListener);
  }
};

bootUp();

//listening for the update-sticker message and delete sticker message
chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  //update sticker
  console.log("background script receiving message");

  if (request.subject && request.subject === "showSticker") {
    console.log("background received show sticker msg");
  }

  if (request.msg && request.msg === "archiveSticker") {
    console.log("archiving sticker");
    const user = await getUser();
    const archiveResponse = await axios.post(
      `${ngrokUrl}api/stickers/archive/${user.id}/${request.id}`
    );
    return true;
  }

  if (request.msg && request.msg === "unarchiveSticker") {
    console.log("unarchiving sticker");
    const user = await getUser();
    const unarchiveResponse = await axios.delete(
      `${ngrokUrl}api/stickers/archive/${user.id}/${request.id}`
    );
    return true;
  }

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

  //delete sticker
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

  if (request.msg && request.msg === "activateAutoLoad") {
    console.log("activating auto load");
    chrome.extension.onConnect.addListener(loadListener);
  }

  if (request.msg && request.msg === "deactivateAutoLoad") {
    console.log("deactivating auto load");
    chrome.extension.onConnect.removeListener(loadListener);
  }

  //if receiving a message to toggle auto-load
  //add or remove the auto-load listener
});
