/* eslint-disable max-statements */
console.log("in build sticker...");
import saveSticker from "./saveSticker";
import buildContainer from "./buildContainer";
import buildStickerArea from "./buildStickerArea";

export default function buildSticker(stickerProp) {
  let {
    text,
    left,
    top,
    width,
    height,
    id,
    shareType,
    userId,
    mine,
  } = stickerProp;
  //build sticker container

  let toggleEdit = false;
  // let stickerId = parseFloat(Math.random() * 10000);
  let stickerId = id;

  //build sticker container,
  //build sticker area
  //build button area
  //build save, edit, delete buttons

  //build sticker container
  const stickerContainer = buildContainer(stickerProp);
  document.body.appendChild(stickerContainer);

  //build sticker area
  const sticker = buildStickerArea(stickerProp);
  sticker.className = "sticker";
  stickerContainer.appendChild(sticker);

  //build sticker buttons
  let stickerButtons = document.createElement("DIV");
  stickerContainer.appendChild(stickerButtons);

  //add save button if it's my own sticker
  console.log("checking mine");
  if (mine) {
    let saveButton = document.createElement("Button");
    saveButton.className = "stickerButton";
    saveButton.style.bottom = "10%";
    saveButton.innerHTML = "save";
    stickerButtons.appendChild(saveButton);
    stickerButtons.style.display = "flex";
    stickerButtons.style.flexDirection = "row";
    stickerButtons.style.justifyContent = "space-between";

    //send message to background w/ sticker info (successful)
    saveButton.addEventListener("click", function (event) {
      console.log("event:", event);
      console.log(
        "event parent: ",
        event.target.parentNode.parentNode.children[0]
      );
      const stickerDiv = event.target.parentNode.parentNode.children[0];
      const updatedSticker = saveSticker(stickerDiv);
      updatedSticker.id = id;
      chrome.runtime.sendMessage({
        msg: "saveSticker",
        URL: window.location.href,
        sticker: updatedSticker,
      });
      return true;
    });

    console.log("adding edit button");
    //add edit button
    const editButton = document.createElement("Button");
    editButton.className = "stickerButton";
    editButton.style.bottom = "10%";
    editButton.innerHTML = "edit";
    stickerButtons.appendChild(editButton);

    const editButtonHandler = (event) => {
      const currentSticker = document.getElementById(`sticker${stickerId}`);
      if (!toggleEdit) {
        console.log("edit clicked");
        console.log("sticker: ", sticker);

        let input;
        //store the sticker html as default text for the input field
        let defaultText = sticker.innerHTML;
        //clear the sticker html
        currentSticker.innerHTML = "";
        //build input field
        input = document.createElement("TEXTAREA");
        input.setAttribute("id", `stickerInput${stickerId}`);
        //set text from earlier sticker text
        input.innerHTML = defaultText;
        input.setAttribute("value", defaultText);
        currentSticker.appendChild(input);
        //set size of textbox
        input.style.width = "100%";
        input.style.height = "100%";
        input.style.resize = "none";
        editButton.innerHTML = "done";
      } else {
        console.log("done clicked");
        editButton.innerHTML = "edit";
        const input = document.getElementById(`stickerInput${stickerId}`);
        currentSticker.innerHTML = input.value;
        input.remove();
      }
      toggleEdit = !toggleEdit;
      //input.focus();
    };

    editButton.addEventListener("click", (event) => editButtonHandler(event));
    // editButton.onclick((event) => editButtonHandler(event));
  }

  //add delete button
  let stickerDelete = document.createElement("Button");
  stickerDelete.className = "stickerButton";
  stickerDelete.style.bottom = "10%";
  stickerDelete.innerHTML = "delete";
  stickerDelete.innerHTML = "delete";
  stickerButtons.appendChild(stickerDelete);

  //delete the sticker ** NEED TO UPDATE TO REMOVE FROM DB
  stickerDelete.addEventListener("click", function () {
    console.log("clicked");
    document.body.removeChild(stickerContainer);
    if (mine) {
      //send message to background to delete from db
      chrome.runtime.sendMessage({
        msg: "deleteSticker",
        URL: window.location.href,
        stickerId,
      });
    }
  });

  //DRAGGING ************************

  sticker.ondragstart = function () {
    return false;
  };

  stickerContainer.onmousedown = function (event) {]
    //don't drag if clicking on a button
    if (event.target.className === "stickerButton") return;

    const stickerContainer = this;

    //shift z-index
    stickerContainer.style.zIndex += 1;

    //fetch the difference between the click position and the top left of the sticker container
    let shiftX = event.clientX - stickerContainer.getBoundingClientRect().left;
    let shiftY = event.clientY - stickerContainer.getBoundingClientRect().top;

    //fetch the width & height of the sticker container
    let widthNum = stickerContainer.getBoundingClientRect().width;
    let heightNum = stickerContainer.getBoundingClientRect().height;

    //if the user is resizing the sticker in the bottom left, do nothing
    if (shiftX > widthNum * 0.8 && shiftY > heightNum * 0.75) return;

    //initial non-move
    moveStartingAt(event.pageX, event.pageY);

    //move the sticker container to the cursor location, offset by the initial cursor
    //location within the container div
    function moveStartingAt(pageX, pageY) {
      stickerContainer.style.left = pageX - shiftX + "px";
      stickerContainer.style.top = pageY - shiftY + "px";
    }

    //while the mouse is moving, reposition the stickerContainer
    function onMouseMove(event) {
      moveStartingAt(event.pageX, event.pageY);
    }

    //listen for movement at the document (highest) level, in case curosr moves beyond sticker
    document.addEventListener("mousemove", onMouseMove);

    //remove listener from document to move and remove onmouseup after complete
    stickerContainer.onmouseup = function () {
      document.removeEventListener("mousemove", onMouseMove);
      stickerContainer.onmouseup = null;
    };
  };

  //DRAGGING COMPLETE

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

  // function dblClickHandler(event) {
  //   console.log("dblclick event: ", event);
  //   // let sticker = document.getElementById("sticker");
  //   let sticker = event.target;
  //   console.log("sticker: ", sticker);
  //   //if the sticker doesn't have an input field already (e.g. hasn't been dbl clicked)
  //   if (sticker.id !== "stickerInput") {
  //     let input;
  //     //store the sticker html as default text for the input field
  //     let defaultText = sticker.innerHTML;
  //     //clear the sticker html
  //     sticker.innerHTML = "";
  //     //build input field
  //     input = document.createElement("TEXTAREA");
  //     input.setAttribute("id", "stickerInput");
  //     //set text from earlier sticker text
  //     input.innerHTML = defaultText;
  //     input.setAttribute("value", defaultText);
  //     sticker.appendChild(input);
  //     //set size of textbox
  //     input.style.width = "100%";
  //     input.style.height = "100%";
  //     input.style.resize = "none";
  //     input.focus();
  //   }
  //   document.addEventListener("focusin", focusInText, true);
  //   document.addEventListener("focusout", focusOutText, true);
  //   console.log("sticker: ", sticker);
  // }
}
