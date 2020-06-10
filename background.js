/* eslint-disable max-statements */
//just tested getting rid of this... not sure why I would need it anymore
//if the popup isn't open it can't receive messaages so that's a reason we need the background script
import axios from "axios";
const ngrokUrl = require("./popupApp/components/ngrok");
import getStickers from "./utils/getStickers";

chrome.extension.onConnect.addListener(function (port) {
  port.onMessage.addListener(async (msg) => {
    const stickers = await getStickers(msg.url);
    port.postMessage({ msg: "sending stickers", urlStickers: stickers });
  });
});

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.msg && request.msg === "saveSticker") {
    //define sticker, fetch user
    const sticker = request.sticker;
    sticker.url = request.URL;
    let promise = new Promise(function (resolve, reject) {
      chrome.storage.sync.get("user", function (user) {
        resolve(user);
      });
    });
    const { user } = await promise;
    sticker.user = user;
    sticker.xPos = sticker.left;
    sticker.yPos = sticker.top;
    console.log("request sticker", request.sticker);

    chrome.storage.sync.set({ [URL]: sticker }, function () {
      console.log(`URL of ${URL} saved with sticker`);
    });

    //testing axios post from background
    const stickerResponse = await axios.post(
      `${ngrokUrl}api/stickers/`,
      sticker
    );

    console.log("sticker response from db: ", stickerResponse);

    //want to send sticker back to dom to update it's ID

    //previously was sending sticker to popup
    // chrome.runtime.sendMessage({
    //   msg: "passing saved sticker to popup",
    //   sticker,
    //   website: URL,
    // });
  }

  if (request.msg && request.msg === "hey background, doc is ready") {
    console.log("finished loading dom");
    const newUrl = request.url;

    if (newUrl.startsWith("chrome://")) {
      console.log("on chrome page");
      return;
    }

    //get user from chrome storage
    let promise = new Promise(function (resolve, reject) {
      chrome.storage.sync.get("user", function (user) {
        resolve(user);
      });
    });
    const { user } = await promise;

    //need to add conditional if user isn't in chrome storage

    const urlStickers = await axios.get(
      `${ngrokUrl}api/stickers/url/${encodeURIComponent(newUrl)}/${user.id}`
    );
    //console.log("url stickers: ", urlStickers);
    const message = { message: "sending stickers", stickers: urlStickers };
    //check db for related stickers, fetch all, send back to content script
    console.log("about to send async response: ", message);
    console.log("sending response");
    sendResponse({ msg: "test sync response" });
    return true;
    console.log("should not see this");

    // const sendStickers = () => {
    //   console.log("trying to send now...");
    //   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //     //the query may need to be updated... in the situation that the current/active tab is not
    //     //the one that just updated...? could match tab w/ url of sticker
    //     chrome.tabs.sendMessage(
    //       tabs[0].id,
    //       { message: "sending stickers", urlStickers },
    //       function (response) {
    //         console.log("response received");
    //       }
    //     );
    //   });
    // };
    // setTimeout(sendStickers, 4000);
    return true;
  }

  return true;
});

// chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
//   // read changeInfo data and do something with it (like read the url)
//   if (changeInfo.url) {
//     //if the tab is a chrome tab, exit
//     const newUrl = changeInfo.url;
//     if (newUrl.startsWith("chrome://")) {
//       console.log("on chrome page");
//       return;
//     }
//     console.log("changeinfo.status: ", changeInfo.status);
//     //if the tab hasn't loaded, exit
//     if (changeInfo.status !== "complete") return;

//     console.log("tab loaded!");
//     console.log("url info: ", changeInfo.url);

//     //get user from chrome storage
//     let promise = new Promise(function (resolve, reject) {
//       chrome.storage.sync.get("user", function (user) {
//         resolve(user);
//       });
//     });
//     const { user } = await promise;

//     //need to add conditional if user isn't in chrome storage

//     const urlStickers = await axios.get(
//       `${ngrokUrl}api/stickers/url/${encodeURIComponent(newUrl)}/${user.id}`
//     );
//     console.log("url stickers: ", urlStickers);
//     //check db for related stickers, fetch all, send back to content script

//     console.log("tab: ", tab);
//     // chrome.tabs.sendMessage(
//     //   tab.id,
//     //   {
//     //     message: "sending urlStickers back",
//     //     urlStickers,
//     //   },
//     //   function (response) {
//     //     console.log("response received");
//     //   }
//     // );
//     const sendStickers = () => {
//       console.log("trying to send now...");
//       chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//         //the query may need to be updated... in the situation that the current/active tab is not
//         //the one that just updated...? could match tab w/ url of sticker
//         chrome.tabs.sendMessage(
//           tabs[0].id,
//           { message: "sending stickers", urlStickers },
//           function (response) {
//             console.log("response received");
//           }
//         );
//       });
//     };
//     setTimeout(sendStickers, 4000);
//     return true;
//   }

// chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//   //the query may need to be updated... in the situation that the current/active tab is not
//   //the one that just updated...? could match tab w/ url of sticker
//   chrome.tabs.sendMessage(
//     tabs[0].id,
//     { msg: "sending updated sticker back", sticker: stickerResponse },
//     function (response) {
//       console.log("response received");
//     }
//   );
// });
// });
