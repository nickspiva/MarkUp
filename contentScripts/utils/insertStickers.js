import buildSticker from "../subScripts/buildSticker";

export default function insertStickers(arrOfStickers) {
  arrOfStickers.forEach((sticker) => {
    console.log("assembling sticker");
    buildSticker(
      sticker.message,
      sticker.xPos,
      sticker.yPos,
      sticker.width,
      sticker.height,
      sticker.id,
      sticker.shareType,
      sticker.userId,
      sticker.mine
    );
  });
}
