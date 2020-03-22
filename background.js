chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("in background, message received!!");
  console.log(request);
  let URL = request.URL;
  let sticker = request.sticker;
  console.log("request sticker", request.sticker);
  //need brackets to save as actual url value?
  chrome.storage.sync.set({ [URL]: sticker }, function() {
    console.log(`URL of ${URL} saved with sticker`);
  });
});
