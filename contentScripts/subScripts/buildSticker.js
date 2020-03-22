console.log("in build sticker...");
import saveSticker from "./saveSticker";

export default function buildSticker(
  text = "default sticker",
  left = "100px",
  top = "100px",
  width = "200px",
  height = "200px"
) {
  //build sticker container
  let stickerContainer = document.createElement("DIV");

  let stickerId = parseFloat(Math.random() * 10000);
  //stickerContainer styling
  stickerContainer.setAttribute("id", `sticker${stickerId}`);
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
  stickerContainer.className = "stickerContainer";

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
  let saveButton = document.createElement("Button");
  saveButton.style.position = "absolute";
  saveButton.style.bottom = "5%";
  saveButton.innerHTML = "save";
  stickerContainer.appendChild(saveButton);

  //add delete button
  let stickerDelete = document.createElement("Button");
  stickerDelete.style.position = "absolute";
  stickerDelete.style.bottom = "5%";
  stickerDelete.innerHTML = "delete";
  stickerDelete.style.right = "5%";
  stickerDelete.innerHTML = "delete";
  stickerContainer.appendChild(stickerDelete);

  //delete the sticker
  stickerDelete.addEventListener("click", function() {
    console.log("clicked");
    stickerDelete.parentNode.parentNode.removeChild(stickerContainer);
  });

  //send message to background w/ sticker info (successful)
  saveButton.addEventListener("click", function(event) {
    console.log("clicked");
    console.log("event: ", event);
    chrome.runtime.sendMessage({
      URL: window.location.href,
      sticker: saveSticker(event)
    });
  });
}

//dragging functionality
// let mouseStatus;
//on down click add event listeners for movement and mouseup
function clickDown(event) {
  //ensures they aren't clicking the resize stickerContainer
  if (event.target.className === "sticker") {
    document.addEventListener("mousemove", dragging, false);
    document.addEventListener("mouseup", releaseClick);
    // mouseStatus = "down";
    console.log("event: ", event);
    event.target.parentNode.style.borderColor = "blue";
  }
}

//if mouse is clicked drag the thing
function dragging(event) {
  // console.log("event: ", event);
  // if (mouseStatus === "down") {
  let x = event.clientX;
  let y = event.clientY;
  // let stickerContainer = document.getElementById("stickerContainer");
  let stickerContainer = event.target.parentNode;
  //centers the drag, would prefer to have it drag from where you clicked
  stickerContainer.style.left = `${x -
    Number(stickerContainer.style.width.split("p")[0]) / 2}px`;
  stickerContainer.style.top = `${y -
    Number(stickerContainer.style.height.split("p")[0]) / 2}px`;
  // }
}

function releaseClick(event) {
  //remove event listener change mouse status
  //   mouseStatus = "up";
  document.removeEventListener("mousemove", dragging, false);
  event.target.parentNode.style.borderColor = "black";
  //turned off so it only saves on click
  // saveSticker(event);
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
  console.log("dblclick event: ", event);
  // let sticker = document.getElementById("sticker");
  let sticker = event.target;
  console.log("sticker: ", sticker);
  //if the sticker doesn't have an input field already (e.g. hasn't been dbl clicked)
  if (sticker.id !== "stickerInput") {
    let input;
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
    input.focus();
  }
  document.addEventListener("focusin", focusInText, true);
  document.addEventListener("focusout", focusOutText, true);
  console.log("sticker: ", sticker);
}

//build a sticker onload
