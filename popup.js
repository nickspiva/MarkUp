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
    alert("you clicked add sticker");
    chrome.tabs.executeScript({
      file: "addSticker.js"
    });
    // window.addEventListener("DOMContentLoaded", () => {
    //   chrome.tabs.query(
    //     {
    //       active: true,
    //       currentWindow: true
    //     },
    //     tabs => {
    //       chrome.tabs.sendMessage(tabs[0], {
    //         from: "popup",
    //         subject: "DOMInfo"
    //       });
    //     }
    //   );
    // });
  };
};

// chrome.runtime.onConnect.addListener(function(port) {
//   console.assert(port.name == "knockknock");
//   port.onMessage.addListener(function(msg) {
//     if (msg.joke == "Knock knock")
//       port.postMessage({ question: "Who's there?" });
//     else if (msg.answer == "Madame")
//       port.postMessage({ question: "Madame who?" });
//     else if (msg.answer == "Madame... Bovary")
//       port.postMessage({ question: "I don't get it." });
//   });
// });
