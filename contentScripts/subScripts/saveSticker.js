export default function saveSticker(event) {
  let stickerObj;
  if (event.target.className == "sticker") {
    console.log("coming from sticker");
    console.log("event: ", event);
  } else {
    console.log("coming from save button");
    console.log("sticker container: ", event.target.parentNode);
    console.log("inner html: ", event.target.previousElementSibling.innerText);
    stickerObj = {
      message: event.target.previousElementSibling.innerText,
      left: event.target.parentNode.style.left,
      top: event.target.parentNode.style.top,
      height: event.target.parentNode.style.height,
      width: event.target.parentNode.style.width,
      user: "inProgress"
    };
  }

  return stickerObj;
}
