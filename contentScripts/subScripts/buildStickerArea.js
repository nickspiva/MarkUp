export default function buildStickerArea(stickerProp) {
  const { text, id } = stickerProp;
  const sticker = document.createElement("DIV");
  sticker.innerHTML = text;
  sticker.setAttribute("id", `sticker${id}`);
  sticker.className = "sticker";
  sticker.style.height = "100%";
  sticker.style.width = "100%";
  return sticker;
}
