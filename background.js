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

const messageHandler = async (request, sendResponse) => {
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

  //when a user clicks from the popup to load stickers
  if (request.msg && request.msg === "loadPageStickers") {
    const { autoLoad } = await getUser();
    //essentially, if the user already has autoLoad set to happen
    //no need to load in the stickers here
    const newUrl = request.url;
    chrome.tabs.create({ url: newUrl }, async function (tab) {
      if (autoLoad) return;
      const stickers = await getStickers(newUrl);
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (tabId === tab.id && changeInfo.status === "complete") {
          chrome.tabs.onUpdated.removeListener(listener);
          chrome.tabs.sendMessage(tabId, {
            subject: "loadStickers",
            stickers: stickers.data,
            tab,
          });
        }
      });
    });
  }

  if (request.msg && request.msg === "checkingAutoLoad") {
    console.log("checking autoload");
    const user = await getUser();
    console.log("user: ", user);
    sendResponse({ autoLoad: user.autoLoad });
  }
};

//listening for the update-sticker message and delete sticker message
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("background script receiving message");
  messageHandler(request, sendResponse);
  return true;
});
