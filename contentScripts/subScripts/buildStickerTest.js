/* eslint-disable max-statements */
console.log("in build sticker...");
import buildContainer from "./buildContainer";

/*
 * Takes a sticker prop and builds a sticker for insertion into the DOM.
 * @param stickerProp, {obj}, contains basic sticker info
 * text (what text is inside the sticker)
 * left & top (position of the sticker)
 * width & height (size of the sticker)
 * id (id of the sticker from db - unique)
 * shareType (what type of shared sticker it is, e.g. withFriends)
 * mine (boolean indicating whether the sticker belongs to the user)
 * TBI: userName (userName of the creator of the sticker)
 */

const buildSticker = (stickerProp) => {
  //extract object properties
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
    userName,
  } = stickerProp;

  //HTML components of the sticker
  //--container
  //----sticker area
  //----sticker buttons
  //------edit (if yours)
  //------delete (if yours)
  //------archive

  /* Table of Contents
   * Build HTML elements
   * Establish relationships between elements
   * Apply styling to elements
   * Define edit, save, delete, & archive functions
   * Add listeners to buttons
   * Add dragging functionality/listener to sticker container
   */

  //BUILD KEY HTML ELEMENTS
  const stickerContainer = buildContainer(stickerProp);
  stickerContainer.setAttribute("id", `stickercontainer${id}`);
  const sticker = document.createElement("DIV");
  sticker.setAttribute("id", `sticker${id}`);
  sticker.innerHTML = text;
  const stickerButtons = document.createElement("DIV");
  const editButton = document.createElement("Button");
  const deleteButton = document.createElement("Button");
  const archiveButton = document.createElement("Button");
  const stickerBanner = document.createElement("DIV");
  stickerBanner.innerHTML = userName;

  //ESTABLISH RELATIONSHIPS B/W HTML ELEMENTS
  document.body.appendChild(stickerContainer);
  stickerContainer.appendChild(sticker);
  stickerContainer.appendChild(stickerButtons);
  if (mine) {
    stickerButtons.appendChild(editButton);
    stickerButtons.appendChild(deleteButton);
  }
  stickerButtons.appendChild(archiveButton);
  stickerContainer.appendChild(stickerBanner);

  //ADD STYLES
  sticker.className = "sticker";
  stickerContainer.className = "stickerContainer";
  stickerButtons.className = "stickerButtonContainer";
  editButton.className = "stickerButton edit";
  deleteButton.className = "stickerButton delete";
  archiveButton.className = "stickerButton archive";
  stickerBanner.className = "stickerBanner";

  //ADD BUTTON TEXT
  editButton.innerHTML = "edit";
  deleteButton.innerHTML = "delete";
  archiveButton.innerHTML = "archive";

  //------------------------------------------

  //SETUP BUTTON FUNCTIONALITY

  //DEFINE FUNCTIONALITY
  function handleEdit(event) {
    console.log("event: ", event);
    const currentSticker = document.getElementById(`sticker${id}`);
    //store the sticker html as default text for the input field
    let defaultText = sticker.innerHTML;
    currentSticker.innerHTML = "";

    //build input field
    //set text from earlier sticker text, set style & initial value
    let input = document.createElement("TEXTAREA");
    input.setAttribute("id", `stickerInput${id}`);
    input.innerHTML = defaultText;
    input.setAttribute("value", defaultText);
    input.className = "stickerInput";

    //attach input and update listeners and button text
    currentSticker.appendChild(input);
    editButton.innerHTML = "done";
    editButton.removeEventListener("click", handleEdit);
    sticker.removeEventListener("dblclick", handleEdit);
    editButton.addEventListener("click", finishEdit);
  }

  function finishEdit(event) {
    //update button text, update sticker innerHTML, remove input
    const currentSticker = document.getElementById(`sticker${id}`);
    editButton.innerHTML = "edit";
    const input = document.getElementById(`stickerInput${id}`);
    currentSticker.innerHTML = input.value;
    input.remove();
    //update listeners
    editButton.removeEventListener("click", finishEdit);
    editButton.addEventListener("click", handleEdit);
    sticker.addEventListener("dblclick", handleEdit);
    saveSticker(currentSticker);
  }

  function deleteSticker(event) {
    document.body.removeChild(stickerContainer);
    if (mine) {
      //send message to background to delete from db
      chrome.runtime.sendMessage({
        msg: "deleteSticker",
        URL: window.location.href,
        stickerId: id,
      });
    }
  }

  function saveSticker(stickerDiv) {
    const updatedSticker = {
      message: stickerDiv.innerText,
      left: stickerDiv.parentNode.style.left,
      top: stickerDiv.parentNode.style.top,
      height: stickerDiv.parentNode.style.height,
      width: stickerDiv.parentNode.style.width,
      user: "inProgress",
    };
    updatedSticker.id = id;
    chrome.runtime.sendMessage({
      msg: "saveSticker",
      URL: window.location.href,
      sticker: updatedSticker,
    });
    return true;
  }

  //ATTACH LISTENERS
  if (mine) {
    editButton.addEventListener("click", handleEdit);
    deleteButton.addEventListener("click", deleteSticker);
  }

  archiveButton.addEventListener("click", (event) => {
    console.log("clicked");
  });

  sticker.addEventListener("dblclick", handleEdit);

  //--------------------------------------

  //SETUP DRAGGING FUNCTIONALITY
  //three key functions: clickDown, dragging, releaseClick

  stickerContainer.onmousedown = function (event) {
    //don't drag if clicking on a button
    if (event.target.className === "stickerButton") return;
    if (event.target.className === "stickerInput") return;

    const stickerContainer = this;

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
    document.addEventListener("mousemove", onMouseMove, true);

    //remove listener from document to move and remove onmouseup after complete
    stickerContainer.onmouseup = function () {
      document.removeEventListener("mousemove", onMouseMove, true);
      stickerContainer.onmouseup = null;
      //save when user finishes dragging
      const sticker = document.getElementById(`sticker${id}`);
      saveSticker(sticker);
    };
  };
  //DRAGGING COMPLETE
};

export default buildSticker;
