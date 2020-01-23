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
        // console.log(oldMessage);
        alert(oldMessage[thisPage].message);
      });
    });
  };
};
