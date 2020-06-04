const router = require("express").Router();
const Sticker = require("../db/sticker");
const User = require("../db/user");

//get all stickers
router.get("/", async (req, res, next) => {
  try {
    //in the future would like to set up req.user
    //not sure how that works w/ extensions...
    const userId = req.body.userId;
    const user = await User.findByPk(userId);
    let stickers = await user.getStickers();
    res.json(stickers);
  } catch (err) {
    next(err);
  }
});

//getting stickers based on URL
router.use("/URL", require("./URL"));

//getting stickers based on tagged
router.use("/tagged", require("./tagged"));

//getting public stickers
router.use("/public", require("./public"));

//get all the stickers that my friends tagged me in

//get all the stickers that my friends tagged me in from a given URL

//picks the array of props from an object and doesn't assign keys to the returned object
//that are falsey
const pickPropsFromObj = (props, obj) => {
  return props.reduce((acc, prop) => {
    const value = obj[prop];
    if (obj[prop]) {
      return { ...acc, [prop]: value };
    }
    return acc;
  }, {});
};

//add a sticker to the database
router.post("/", async (req, res, next) => {
  try {
    const stickerData = pickPropsFromObj(
      ["message", "height", "width", "xPos", "yPos", "url"],
      req.body
    );

    //extract @ tags & # tags
    const words = req.body.message.split(" ");
    const atTags = words
      .filter((elem) => elem[0] === "@")
      .map((elem) => elem.slice(1));
    stickerData.atTags = atTags;

    const hashTags = words
      .filter((elem) => elem[0] === "#")
      .map((elem) => elem.slice(1));
    stickerData.hashTags = hashTags;

    //determine share type (scoping down from public to self only)
    let shareType;

    //if there are any at tags it is atleast to be shared with a few
    if (atTags.length) shareType = "withAFew";
    //if it includes friends tag, share with all friends, update
    if (atTags.includes("friends")) shareType = "withFriends";
    //if it includes public tag, share with public, update
    if (atTags.includes("public")) shareType = "withWorld";
    //if @onlyMe disregard other sharing info
    if (atTags.includes("onlyMe")) shareType = "withSelf";
    //default: if no tags, share with friends
    if (atTags.length === 0) shareType = "withFriends";
    stickerData.shareType = shareType;

    const sticker = await Sticker.create(stickerData);
    //currently hardcoded the user pk, will need to update
    const user = await User.findByPk(1);
    sticker.setUser(user);
    res.json(sticker);
  } catch (err) {
    next(err);
  }
});

//update an existing sticker
router.put("/", async (req, res, next) => {});

//delete a sticker

module.exports = router;
