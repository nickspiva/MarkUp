console.log("testing capturing DOM", document);

// chrome.runtime.sendMessage(document); //practicing sending messages to background.js
// //alert(document.domain);

chrome.runtime.sendMessage({
  from: "content",
  subject: "setSticker"
});

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  console.log("message incoming");
  console.log(msg);
  if (msg.sticker.user) {
    console.log("adding sticker");
    //insert sticker (copied from add sticker)
    let mouseStatus;
    //on down click add event listeners for movement and mouseup
    function clickDown(event) {
      //ensures they aren't clicking the resize stickerContainer
      if (event.target.id === "sticker") {
        document.addEventListener("mousemove", dragging, false);
        document.addEventListener("mouseup", releaseClick);
        mouseStatus = "down";
        document.getElementById("stickerContainer").style.borderColor = "blue";
      }
    }

    //if mouse is clicked drag the thing
    function dragging(event) {
      if (mouseStatus === "down") {
        let x = event.clientX;
        let y = event.clientY;
        let stickerContainer = document.getElementById("stickerContainer");
        //centers the drag, would prefer to have it drag from where you clicked
        stickerContainer.style.left = `${x -
          Number(stickerContainer.style.width.split("p")[0]) / 2}px`;
        stickerContainer.style.top = `${y -
          Number(stickerContainer.style.height.split("p")[0]) / 2}px`;
      }
    }

    function releaseClick() {
      //remove event listener change mouse status
      mouseStatus = "up";
      document.removeEventListener("mousemove", dragging, false);
      document.getElementById("stickerContainer").style.borderColor = "black";
      saveSticker();
    }

    //focus functionality (flipping between input and text)
    function focusInText() {
      console.log("focused: ", document.activeElement);
    }
    function focusOutText(event) {
      let input = document.getElementById("stickerInput");
      let sticker = document.getElementById("sticker");
      //if the thing that lost focus was the input field then...
      if (event.target.id === "stickerInput") {
        //log out the value of the input
        console.log(document.getElementById("stickerInput").value);
        //remove the focus event listeners
        document.removeEventListener("focusin", focusInText, true);
        document.removeEventListener("focusout", focusOutText, true);
        //set the text of the field to be the inputed text
        let newText = input.value;
        sticker.innerHTML = newText;
      }
    }

    function dblClickHandler(event) {
      let sticker = document.getElementById("sticker");
      let input;
      //if the sticker doesn't have an input field already (e.g. hasn't been dbl clicked)
      if (sticker.childElementCount < 1) {
        //store the sticker html as default text for the input field
        let defaultText = sticker.innerHTML;
        //clear the sticker html
        sticker.innerHTML = "";
        //build input field
        input = document.createElement("TEXTAREA");
        input.setAttribute("id", "stickerInput");
        //set text from earlier sticker text
        input.innerHTML = defaultText;
        input.setAttribute("value", defaultText);
        sticker.appendChild(input);
        //set size of textbox
        input.style.width = "100%";
        input.style.height = "100%";
        input.style.resize = "none";
      }
      document.addEventListener("focusin", focusInText, true);
      document.addEventListener("focusout", focusOutText, true);
    }

    //sticker creation functionality
    function buildSticker(
      text = "default sticker",
      left = "100px",
      top = "100px",
      width = "200px",
      height = "200px"
    ) {
      //build sticker container
      let stickerContainer = document.createElement("DIV");
      //stickerContainer styling
      stickerContainer.setAttribute("id", "stickerContainer");
      stickerContainer.style.padding = "20px";
      stickerContainer.style.top = top;
      stickerContainer.style.height = height;
      stickerContainer.style.width = width;
      stickerContainer.style.left = left;
      stickerContainer.style.borderColor = "blue";
      stickerContainer.style.position = "absolute";
      stickerContainer.style.backgroundColor = "lightgrey";
      stickerContainer.style.border = "5px solid black";
      stickerContainer.style["border-radius"] = "3px";
      stickerContainer.style.overflow = "auto";
      stickerContainer.style.resize = "both";
      stickerContainer.style.zIndex = 999;

      //build actual sticker
      let sticker = document.createElement("DIV");
      //affix to sticker container
      stickerContainer.appendChild(sticker);

      //affix both to document body (high level)
      document.body.appendChild(stickerContainer);
      sticker.innerHTML = text;
      sticker.setAttribute("id", "sticker");
      sticker.className = "sticker";
      sticker.style.height = "100%";
      sticker.style.width = "100%";
      sticker.ondragstart = function() {
        return false;
      };
      sticker.ondblclick = dblClickHandler;
      stickerContainer.onmousedown = clickDown;

      //add save button
      let stickerButton = document.createElement("Button");
      stickerButton.style.position = "absolute";
      stickerButton.style.bottom = "5%";
      stickerButton.innerHTML = "save";
      stickerContainer.appendChild(stickerButton);

      let stickerDelete = document.createElement("Button");
      stickerDelete.style.position = "absolute";
      stickerDelete.style.bottom = "5%";
      stickerDelete.innerHTML = "delete";
      stickerDelete.style.right = "5%";
      stickerDelete.innerHTML = "delete";

      stickerContainer.appendChild(stickerDelete);

      //send message to background w/ sticker info (successful)
      stickerButton.addEventListener("click", function() {
        console.log("clicked");
        chrome.runtime.sendMessage({
          URL: window.location.href,
          sticker: saveSticker()
        });
      });

      //delete the sticker
      stickerDelete.addEventListener("click", function() {
        console.log("clicked");
        stickerDelete.parentNode.parentNode.removeChild(stickerContainer);
      });
    }

    // text = "default sticker",
    // left = "100px",
    // top = "100px",
    // width = "200px",
    // height = "200px"

    //build a sticker onload
    document.onload = buildSticker(
      msg.sticker.message,
      msg.sticker.left,
      msg.sticker.top,
      msg.sticker.width,
      msg.sticker.height
    );

    saveSticker = () => {
      let stickerObj = {
        message: document.getElementById("sticker").innerHTML,
        left: document.getElementById("stickerContainer").style.left,
        top: document.getElementById("stickerContainer").style.top,
        height: document.getElementById("stickerContainer").style.height,
        width: document.getElementById("stickerContainer").style.width,
        user: "inProgress"
      };

      return stickerObj;
    };
  }
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
