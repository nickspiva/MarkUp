// import buildSticker from "../subScripts/buildSticker";
import buildSticker from "../subScripts/buildStickerTest";

export default function insertStickers(arrOfStickers) {
  arrOfStickers.forEach((sticker) => {
    console.log("assembling sticker");

    buildSticker({
      text: sticker.message,
      left: sticker.xPos,
      top: sticker.yPos,
      width: sticker.width,
      height: sticker.height,
      id: sticker.id,
      shareType: sticker.shareType,
      userId: sticker.userId,
      mine: sticker.mine,
      userName: sticker.user.userName,
    });
  });
}
