import insertStickers from "../utils/insertStickers";

//Once page has loaded, send msg to background to fetch associated stickers, then insert in DOM
document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    var port = chrome.runtime.connect({ name: "loadedURL" });
    port.postMessage({ subject: "site ready", url: document.location.href });
    port.onMessage.addListener(function (msg) {
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
  console.log("content script / tab recieving message");
  console.log("request: ", request);
  insertStickers([request.sticker.data]);
});
