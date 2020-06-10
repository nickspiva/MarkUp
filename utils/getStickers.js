const ngrokUrl = require("../popupApp/components/ngrok");
import getUser from "./getUser";
import axios from "axios";

export default async function getStickers(url) {
  //get user from chrome storage, need to add conditional in case no user
  const user = await getUser();
  const urlStickers = await axios.get(
    `${ngrokUrl}api/stickers/url/${encodeURIComponent(url)}/${user.id}`
  );
  return urlStickers;
}
