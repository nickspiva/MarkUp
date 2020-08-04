import insertStickers from "../utils/insertStickers";

//Once page has loaded, send msg to background to fetch associated stickers, then insert in DOM
document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    var port = chrome.runtime.connect({ name: "loadedURL" });
    port.postMessage({ subject: "site ready", url: document.location.href });
    port.onMessage.addListener(function (msg) {
      console.log("stickers: ", msg.urlStickers.data);
      insertStickers(msg.urlStickers.data);
    });
  }
};

//Listen to message from the popup requesting to add a new sticker
chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  //if the request is one requesting to add a new sticker, then insert the stickers
  if (request.subject === "adding new sticker") {
    insertStickers([request.sticker.data]);
  }
});
