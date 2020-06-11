export default function buildContainer(stickerProp) {
  let stickerContainer = document.createElement("DIV");

  const { left, top, width, height, id, mine } = stickerProp;
  stickerContainer.setAttribute("id", `stickercontainer${id}`);

  stickerContainer.style.padding = "20px";
  stickerContainer.style.top = top;
  stickerContainer.style.height = height;
  stickerContainer.style.width = width;
  stickerContainer.style.left = left;
  stickerContainer.style.borderColor = "blue";
  stickerContainer.style.position = "absolute";
  stickerContainer.style.backgroundColor = mine ? "lightgrey" : "lightblue";
  stickerContainer.style.border = "5px solid black";
  stickerContainer.style["border-radius"] = "3px";
  stickerContainer.style.overflow = "auto";
  stickerContainer.style.resize = "both";
  stickerContainer.style.zIndex = 999;
  stickerContainer.style.display = "flex";
  stickerContainer.style.flexDirection = "column";
  stickerContainer.className = "stickerContainer";

  return stickerContainer;
}
