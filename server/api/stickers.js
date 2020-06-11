const router = require("express").Router();
const Sticker = require("../db/sticker");
const User = require("../db/user");
const getFriendIds = require("./utils/getFriendIds");
const pickPropsFromObj = require("./utils/pickPropsFromObj");

//**HELPER FUNCTIONS**

//helper function to extract and assign @ and # tags
//to sticker from message prior to creation/update of sticker in db
const extractAndAssignTags = (sticker, message) => {
  const words = message.split(" ");
  const atTags = words
    .filter((elem) => elem[0] === "@")
    .map((elem) => elem.slice(1));
  sticker.atTags = atTags;

  const hashTags = words
    .filter((elem) => elem[0] === "#")
    .map((elem) => elem.slice(1));
  sticker.hashTags = hashTags;
};

//helper function to determine sharetype
const assignShareType = (sticker) => {
  let shareType;
  //if there are any at tags it is atleast to be shared with a few
  if (sticker.atTags.length) shareType = "withAFew";
  //if it includes friends tag, share with all friends, update
  if (sticker.atTags.includes("friends")) shareType = "withFriends";
  //if it includes public tag, share with public, update
  if (sticker.atTags.includes("public")) shareType = "withWorld";
  //if @onlyMe disregard other sharing info
  if (sticker.atTags.includes("onlyMe")) shareType = "withSelf";
  //default: if no tags, share with friends
  if (sticker.atTags.length === 0) shareType = "withFriends";
  sticker.shareType = shareType;
};

//**API ROUTES**

//middleware routers (advanced sticker fetching)
router.use("/URL", require("./URL")); //getting stickers based on URL
router.use("/tagged", require("./tagged")); //getting tagged stickers
router.use("/public", require("./public")); //getting public stickers

//get all the user's friends stickers that have been shared with all friends
router.get("/friends/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const friendIds = await getFriendIds(userId);
    const taggedStickers = await Sticker.findAll({
      where: {
        userId: friendIds,
        shareType: "withFriends",
      },
    });
    res.json(taggedStickers);
  } catch (err) {
    next(err);
  }
});

//get all the user's stickers
router.get("/:userId", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);
    const stickers = await user.getStickers();
    res.json(stickers);
  } catch (err) {
    next(err);
  }
});

//add a sticker to the database
router.post("/", async (req, res, next) => {
  try {
    const stickerData = pickPropsFromObj(
      ["message", "height", "width", "xPos", "yPos", "url"],
      req.body
    );
    extractAndAssignTags(stickerData, req.body.message);
    assignShareType(stickerData);
    const sticker = await Sticker.create(stickerData);
    const user = await User.findByPk(req.body.user.id);
    await sticker.setUser(user);
    res.json(sticker);
  } catch (err) {
    next(err);
  }
});

//update an existing sticker
router.put("/:stickerId", async (req, res, next) => {
  try {
    const sticker = await Sticker.findByPk(req.params.stickerId);
    const updateFields = ["message", "height", "width", "xPos", "yPos"];
    updateFields.forEach((elem) => {
      sticker[elem] = req.body.sticker[elem];
    });
    extractAndAssignTags(sticker, req.body.sticker.message);
    assignShareType(sticker);
    await sticker.save();
    res.send(sticker);
  } catch (err) {
    next(err);
  }
});

//delete a sticker
router.delete("/:stickerId/:userId", async (req, res, next) => {
  try {
    const sticker = await Sticker.findByPk(req.params.stickerId);
    if (sticker.userId.toString() === req.params.userId) {
      console.log("deleting");
      await sticker.destroy();
      res.sendStatus(204);
    } else {
      res.json("not yours to delete");
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
