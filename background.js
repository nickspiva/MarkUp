chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("in background, message received!!");
  console.log(request);
  let URL = request.URL;
  let sticker = request.sticker;
  console.log("request sticker", request.sticker);
  //need brackets to save as actual url value?
  if (request.sticker) {
    chrome.storage.sync.set({ [URL]: sticker }, function () {
      console.log(`URL of ${URL} saved with sticker`);
    });
  }

  chrome.storage.sync.get(null, function (data) {
    console.info(data);
  });

  // if (request.message === "CheckUser") {
  //   console.log('checking user')
  //   chrome.storage.sync.get
  // }
});
