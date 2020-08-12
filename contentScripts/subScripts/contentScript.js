import insertStickers from "../utils/insertStickers";

//Once page has loaded, send msg to background to fetch associated stickers, then insert in DOM
document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    chrome.runtime.sendMessage(
      {
        msg: "checkingAutoLoad",
      },
      function (response) {
        //essentially checking to see if user has autoload on before
        //fetching stickers and inserting them.
        //i'm currently duplicating this in the background script, could change.
        const { autoLoad } = response;
        console.log("autoLoad: ", autoLoad);
        if (autoLoad) {
          var port = chrome.runtime.connect({ name: "loadedURL" });
          port.postMessage({
            subject: "site ready",
            url: document.location.href,
          });
          port.onMessage.addListener(function (msg) {
            console.log("stickers: ", msg.urlStickers.data);
            if (msg.urlStickers.data.length) {
              insertStickers(msg.urlStickers.data);
            }
          });
        }
      }
    );
  }
};

//Listen to message from the popup requesting to add a new sticker
chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  console.log("content received msg");
  console.log("request: ", request);
  //if the request is one requesting to add a new sticker, then insert the stickers
  if (request.subject === "adding new sticker") {
    insertStickers([request.sticker.data]);
  }

  if (request.subject === "showSticker") {
    console.log("toggling sticker visibility");
    console.log("sticker: ", request.sticker);
    insertStickers(request.sticker);
  }

  if (request.subject === "removeSticker") {
    console.log("removing sticker from dom");
    const div = document.getElementById(`stickercontainer${request.id}`);
    if (div) {
      console.log("removing div for real");
      div.remove();
    }
  }

  if (request.subject === "loadStickers") {
    console.log("loading stickers from popup click");
    insertStickers(request.stickers);
  }
});
