const ngrokUrl = require("../popupApp/components/ngrok");
import getUser from "./getUser";
import axios from "axios";
import getToken from "./getToken";

export default async function getStickers(url) {
  //get user from chrome storage, need to add conditional in case no user
  const user = await getUser();
  if (!user) {
    return [];
  }
  const token = await getToken();
  const config = {
    headers: {
      Authorization: `bearer ${token}`,
    },
  };
  console.log("background user: ", user);
  const urlStickers = await axios.get(
    `${ngrokUrl}api/stickers/url/${encodeURIComponent(url)}/${user.id}`,
    config
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
