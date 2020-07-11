const ngrokUrl = require("../popupApp/components/ngrok");
import getUser from "./getUser";
import axios from "axios";

export default async function getStickers(url) {
  //get user from chrome storage, need to add conditional in case no user
  const user = await getUser();
  if (!user) {
    return [];
  }
  console.log("user: ", user);
  const urlStickers = await axios.get(
    `${ngrokUrl}api/stickers/url/${encodeURIComponent(url)}/${user.data.id}`
  );

  urlStickers.data.forEach((sticker) => {
    if (sticker.userId === user.id) {
      sticker.mine = true;
    } else {
      sticker.mine = false;
    }
  });
  console.log("url stickers mine added: ", urlStickers);
  return urlStickers;
}
