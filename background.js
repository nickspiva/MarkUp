// chrome.runtime.onInstalled.addListener(function() {
//   chrome.storage.sync.set({ color: "#3aa757" }, function() {
//     console.log("The color is green.");
//   });
// });

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   console.log(
//     sender.tab
//       ? "from a content script: " + sender.tab.url
//       : "from the extension"
//   );
//   if (request.type === "sentSticker") {
//     console.log("sticker: ", request.sticker);
//     sendResponse({ farewell: "goodbye" });
//   }
//   return true;
// });

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("message received!!");
  console.log(request);
  let URL = request.URL;
  let sticker = request.sticker;
  console.log("request sticker", request.sticker);
  //need brackets to save as actual url value?
  chrome.storage.sync.set({ [URL]: sticker }, function() {
    console.log(`URL of ${URL} saved with sticker`);
  });
});
