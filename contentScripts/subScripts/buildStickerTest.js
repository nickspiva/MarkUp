/* eslint-disable max-statements */
console.log("in build sticker...");
import saveSticker from "./saveSticker";
import buildContainer from "./buildContainer";
import buildStickerArea from "./buildStickerArea";

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
  } = stickerProp;

  //HTML components of the sticker
  //--container
  //----sticker area
  //----sticker buttons
  //------edit
  //------archive
  //------delete (if yours)

  //BUILD KEY HTML ELEMENTS
  const stickerContainer = buildContainer(stickerProp);
  const sticker = document.createElement("DIV");
  sticker.setAttribute("id", `sticker${id}`);
  const stickerButtons = document.createElement("DIV");
  const editButton = document.createElement("Button");
  const deleteButton = document.createElement("Button");
  const archiveButton = document.createElement("Button");

  //ESTABLISH RELATIONSHIPS B/W HTML ELEMENTS
  document.body.appendChild(stickerContainer);
  stickerContainer.appendChild(sticker);
  stickerContainer.appendChild(stickerButtons);
  if (mine) {
    stickerButtons.appendChild(editButton);
    stickerButtons.appendChild(deleteButton);
  }
  stickerButtons.appendChild(archiveButton);

  //ADD STYLES
  stickerButtons.className = "stickerButtonContainer";
  editButton.className = "stickerButton";
  deleteButton.className = "stickerButton";
  archiveButton.className = "stickerButton";

  //------------------------------------------

  //SETUP DRAGGING FUNCTIONALITY
  //three key functions: clickDown, dragging, releaseClick
  sticker.ondragstart = function () {
    return false;
  };

  //DRAGGING ************************

  sticker.ondragstart = function () {
    return false;
  };

  sticker.onmousedown = function (event) {
    //fetch sticker top-lvl parent
    const stickerContainer = event.target.parentNode;

    //shift z-index
    stickerContainer.style.zIndex += 1;

    //fetch the difference between the click position and the top left of the sticker container
    let shiftX = event.clientX - stickerContainer.getBoundingClientRect().left;
    let shiftY = event.clientY - stickerContainer.getBoundingClientRect().top;

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
    sticker.onmouseup = function () {
      document.removeEventListener("mousemove", onMouseMove);
      sticker.onmouseup = null;
    };
  };
};
