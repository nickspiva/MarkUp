import buildSticker from "./buildSticker";
import saveSticker from "./saveSticker";

console.log("content script loading");

//what exactly is this doing?
// chrome.runtime.sendMessage({
//   from: "content",
//   subject: "setSticker"
// });

//Adds a listener
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  console.log("in content script, message incoming");
  console.log("msg: ", msg);

  // if (msg.sticker.user) {
  //   console.log("adding sticker");

  //   //build a sticker onload
  //   document.onload = buildSticker(
  //     msg.sticker.message,
  //     msg.sticker.left,
  //     msg.sticker.top,
  //     msg.sticker.width,
  //     msg.sticker.height
  //   );
  // }

  if (msg.message === "sending stickers") {
    console.log("ready to insert stickers");
    console.log("stickers: ", msg.urlStickers);
    const stickers = msg.urlStickers.data;
    stickers.forEach((sticker) => {
      console.log("assembling sticker");
      buildSticker(
        sticker.message,
        sticker.xPos,
        sticker.yPos,
        sticker.width,
        sticker.height,
        sticker.id
      );
    });
  }
  return true;
});

function insertStickers(arrOfStickers) {
  arrOfStickers.forEach((sticker) => {
    console.log("assembling sticker");
    buildSticker(
      sticker.message,
      sticker.xPos,
      sticker.yPos,
      sticker.width,
      sticker.height,
      sticker.id
    );
  });
}

document.onreadystatechange = function () {
  console.log("doc state change: ", document.readyState);
  if (document.readyState === "complete") {
    console.log("my url: ", document.location.href);
    console.log("document ready === complete");
    var port = chrome.runtime.connect({ name: "loadedURL" });
    port.postMessage({ msg: "site ready", url: document.location.href });
    port.onMessage.addListener(function (msg) {
      console.log("content port receiving stickers: ", msg.urlStickers.data);
      insertStickers(msg.urlStickers.data);
    });
    // const message = {
    //   msg: "site ready",
    //   url: document.location.href,
    // };
    // chrome.runtime.sendMessage(message, function (response) {
    //   console.log("receiving response from background");
    //   console.log("response received: ", response);
    //   return true;
    // });
  }
};
