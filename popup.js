window.onload = function() {
  document.getElementById("save").onclick = function() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(
      tabs
    ) {
      let thisPage = tabs[0].url;
      let savedMessage = document.getElementById("saveMessage").value;
      let messageObject = {
        URL: thisPage,
        message: savedMessage,
        user: "in progress"
      };
      alert(`URL: ${thisPage}\nMessage:${savedMessage}\nUser:*inProgress`);
      chrome.storage.sync.set({ [thisPage]: messageObject }, function() {
        alert("message saved successfully!");
      });
    });
  };

  chrome.storage.local.get(["key"], function(result) {
    console.log("Value currently is " + result.key);
  });

  document.getElementById("retrive").onclick = function() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(
      tabs
    ) {
      let thisPage = tabs[0].url;
      console.log(thisPage);
      chrome.storage.sync.get(thisPage, function(oldMessage) {
        alert(oldMessage[thisPage].message);
      });
    });
  };

  document.getElementById("addSticker").onclick = function() {
    console.log("you clicked add sticker");
    chrome.tabs.executeScript({
      file: "addSticker.js"
    });
  };

  document.getElementById("getSticker").onclick = function() {
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
    // chrome.storage.sync.get(currentTab, function(sticker) {
    //   console.log("retrieved sticker**", sticker[currentTab]);
    // });
  };
};
