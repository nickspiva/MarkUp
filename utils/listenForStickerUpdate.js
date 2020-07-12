const listenForUpdates = async (req, res, sendResponse) => {
  console.log("user in message passing: ", user);
  if (req.msg === "passing saved sticker to popup") {
    const sticker = req.sticker;
    sticker.url = req.website;
    sticker.user = user;
    sticker.xPos = sticker.left;
    sticker.yPos = sticker.top;
    console.log("comp mount req.sticker: ", req.sticker);
    const stickerResponse = await axios.post(
      `${ngrokUrl}api/stickers/`,
      sticker
    );
    console.log("sending sticker response: ", stickerResponse);
    // chrome.tabs.query({ active: true, currentWindow: true }, function (
    //   tabs
    // ) {
    //   chrome.tabs.sendMessage(
    //     tabs[0].id,
    //     { msg: "sending updated sticker back", sticker: stickerResponse },
    //     function (response) {
    //       console.log("response received");
    //     }
    //   );
    // });
    sendResponse({
      msg: "got info on stickers",
      sticker: "testing empty sticker",
    });
    return true;
  }
  return true;
};

export default listenForUpdates;
