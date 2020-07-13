const router = require("express").Router();
const Sticker = require("../db/sticker");
const User = require("../db/user");
const getFriendIds = require("./utils/getFriendIds");
const pickPropsFromObj = require("./utils/pickPropsFromObj");
const jwt = require("jsonwebtoken");
const checkToken = require("./utils/checkToken");

//**HELPER FUNCTIONS**

//helper function to extract and assign @ and # tags
//used on sticker from message prior to creation/update of sticker in db
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

//check token is for correct user based on route params
const checkUser = (req, res, next) => {
  try {
    jwt.verify(req.token, process.env.JWT_SECRET, (err, authorizedData) => {
      if (err) {
        console.log("err: ", err.message);
        //if token is expired communicate that back to app
        if (err.message == "jwt expired") {
          res.status(401);
          res.json("token expired");
        } else {
          res.sendStatus(400);
        }
        //throw err;
      } else if (authorizedData.user.id !== parseInt(req.params.userId)) {
        res.status(403).send("wrong user");
      } else {
        //user matches
        next();
      }
    });
  } catch (err) {
    console.log("catching error: ", err);
  }
};

//check token is for correct user based on route params
const checkUserPost = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authorizedData) => {
    if (err) {
      throw err;
    } else if (authorizedData.user.id !== parseInt(req.body.user.id)) {
      res.status(403).send("wrong user");
    } else {
      //user matches
      next();
    }
  });
};

//**API ROUTES**

//middleware routers (advanced sticker fetching)
router.use("/URL", require("./URL")); //getting stickers based on URL
router.use("/tagged", require("./tagged")); //getting tagged stickers
router.use("/public", require("./public")); //getting public stickers

//get all the user's friends stickers that have been shared with all friends
router.get(
  "/friends/:userId",
  checkToken,
  checkUser,
  async (req, res, next) => {
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
  }
);

//get all the user's self-made stickers
router.get("/:userId", checkToken, checkUser, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);
    const stickers = await user.getStickers();
    res.json(stickers);
  } catch (err) {
    next(err);
  }
});

//add a NEW sticker to the database
router.post("/", checkToken, checkUserPost, async (req, res, next) => {
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
router.put("/:stickerId", checkToken, checkUserPost, async (req, res, next) => {
  try {
    const sticker = await Sticker.findByPk(req.params.stickerId);
    if (sticker.message === "") {
      res.sendStatus(200); //message was empty...
    }
    //update each sticker property
    const updateFields = ["message", "height", "width", "xPos", "yPos"];
    updateFields.forEach((elem) => {
      sticker[elem] = req.body.sticker[elem];
    });
    //update tags & sharetype if they changed
    extractAndAssignTags(sticker, req.body.sticker.message);
    assignShareType(sticker);
    await sticker.save();
    res.send(sticker);
  } catch (err) {
    next(err);
  }
});

//delete a sticker
router.delete(
  "/:stickerId/:userId",
  checkToken,
  checkUser,
  async (req, res, next) => {
    try {
      const sticker = await Sticker.findByPk(req.params.stickerId);
      //again confirm you have the right to delete the sticker
      if (sticker.userId.toString() === req.params.userId) {
        await sticker.destroy();
        res.sendStatus(204);
      } else {
        res.json("not yours to delete");
      }
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
