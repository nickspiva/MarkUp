window.onload = function() {
  document.getElementById("addSticker").onclick = function() {
    console.log("in popup, you clicked add sticker");
    chrome.tabs.executeScript({
      file: "addSticker.js"
    });
  };

  document.getElementById("getSticker").onclick = function() {
    console.log("in popup, you clicked get sticker");
    //get url of current tab
    var query = { active: true, currentWindow: true };
    let currentTab;
    let thisTab;
    function getTabs(tabs) {
      thisTab = tabs[0];
      currentTab = tabs[0].url; // there will be only one in this array
      console.log("tabs[0", tabs[0]); // also has properties like currentTab.id
      //to send message to current tab has to be within this query
      chrome.storage.sync.get(currentTab, function(sticker) {
        console.log("retrieved sticker**", sticker[currentTab]);
        chrome.tabs.sendMessage(thisTab.id, {
          sticker: sticker[currentTab]
        });
      });
    }
    chrome.tabs.query(query, getTabs);
    //with just currentTab variable gets all saved info? trying brackets, brackets throw error
  };
};
