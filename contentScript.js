console.log("testing capturing DOM", document);

// chrome.runtime.sendMessage(document); //practicing sending messages to background.js
// //alert(document.domain);

chrome.runtime.sendMessage({
  from: "content",
  subject: "setSticker"
});

console.log("sent message?");

// chrome.runtime.onMessage.addListener((msg, sender, response) => {
//   if (msg.from === "popup" && msg.subject === "DOMInfo") {
//     let stickerText = document.getElementById("sticker").innerHTML;
//     response(stickerText);
//   }
// });

//adds a listener on connect

// var port = chrome.runtime.connect({ name: "knockknock" });
// port.postMessage({ joke: "Knock Knock" });
// port.onMessage.addListener(function(msg) {
//   if (msg.question == "Who's there?") {
//     port.postMessage({ answer: "Madame" });
//   } else if (msg.question == "Madame who?") {
//     port.postMessage({ answer: "Madame... Bovary" });
//   }
// });
