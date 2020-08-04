export default function buildContainer(stickerProp) {
  let stickerContainer = document.createElement("DIV");

  const { left, top, width, height, mine } = stickerProp;
  stickerContainer.style.top = top;
  stickerContainer.style.height = height;
  stickerContainer.style.width = width;
  stickerContainer.style.left = left;
  stickerContainer.style.backgroundColor = mine ? "lightgrey" : "lightblue";

  return stickerContainer;
}
