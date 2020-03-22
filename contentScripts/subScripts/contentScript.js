import buildSticker from "./buildSticker";

//what exactly is this doing?
chrome.runtime.sendMessage({
  from: "content",
  subject: "setSticker"
});

//Adds a listener
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  console.log("message incoming");
  console.log(msg);
  if (msg.sticker.user) {
    console.log("adding sticker");

    //build a sticker onload
    document.onload = buildSticker(
      msg.sticker.message,
      msg.sticker.left,
      msg.sticker.top,
      msg.sticker.width,
      msg.sticker.height
    );
  }
});

console.log("sent message!");
