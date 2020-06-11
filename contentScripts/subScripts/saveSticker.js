export default function saveSticker(sticker) {
  const stickerObj = {
    message: sticker.innerText,
    left: sticker.parentNode.style.left,
    top: sticker.parentNode.style.top,
    height: sticker.parentNode.style.height,
    width: sticker.parentNode.style.width,
    user: "inProgress",
  };

  return stickerObj;
}
