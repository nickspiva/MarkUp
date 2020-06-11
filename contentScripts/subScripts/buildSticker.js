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
  stickerContainer.appendChild(sticker);

  //build sticker buttons
  let stickerButtons = document.createElement("DIV");
  stickerContainer.appendChild(stickerButtons);

  sticker.ondragstart = function () {
    return false;
  };
  // sticker.ondblclick = dblClickHandler;
  stickerContainer.onmousedown = clickDown;

  //add save button if it's my own sticker
  console.log("checking mine");
  if (mine) {
    let saveButton = document.createElement("Button");
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
    stickerContainer.style.left = `${
      x - Number(stickerContainer.style.width.split("p")[0]) / 2
    }px`;
    stickerContainer.style.top = `${
      y - Number(stickerContainer.style.height.split("p")[0]) / 2
    }px`;
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
