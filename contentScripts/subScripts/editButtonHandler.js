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

export default editButtonHandler;
