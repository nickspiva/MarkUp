const router = require("express").Router();
const Sticker = require("../db/sticker");
const User = require("../db/user");
const getFriendIds = require("./utils/getFriendIds");
const pickPropsFromObj = require("./utils/pickPropsFromObj");
const jwt = require("jsonwebtoken");

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

//check req has token
const checkToken = (req, res, next) => {
  console.log("checking token: ", req.headers);
  const header = req.headers["authorization"];
  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    const token = bearer[1];

    req.token = token;
    next();
  } else {
    res.sendStatus(403);
  }
};

//check token is for correct user based on route params
const checkUser = (req, res, next) => {
  console.log("checking user");
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authorizedData) => {
    if (err) {
      console.log("ERROR: could not connect to protected route, no token");
      res.sendStatus(403);
    } else if (authorizedData.user.id !== parseInt(req.params.userId)) {
      console.log(authorizedData.user.id);
      console.log(req.params.userId);
      console.log(req.params.userId === authorizedData.user.id);
      console.log("not your user data");
      res.status(403).send("wrong user");
    } else {
      console.log("user matches!");
      next();
    }
  });
};

//check token is for correct user based on route params
const checkUserPost = (req, res, next) => {
  console.log("checking user post");
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authorizedData) => {
    if (err) {
      console.log("ERROR: could not connect to protected route, no token");
      res.sendStatus(403);
    } else if (authorizedData.user.id !== parseInt(req.body.user.id)) {
      console.log(authorizedData.user.id);
      console.log(req.body.user.id);
      console.log(req.body.user.id === authorizedData.user.id);
      console.log("not your user data");
      res.status(403).send("wrong user");
    } else {
      console.log("user matches!");
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
    console.log("in api route");
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
router.post("/", checkToken, checkUserPost, async (req, res, next) => {
  try {
    console.log("setting up sticker in server");
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
    console.log("in sticker update");
    const sticker = await Sticker.findByPk(req.params.stickerId);
    if (sticker.message === "") {
      console.log("message empty");
      res.sendStatus(200);
    }
    const updateFields = ["message", "height", "width", "xPos", "yPos"];
    updateFields.forEach((elem) => {
      sticker[elem] = req.body.sticker[elem];
    });
    extractAndAssignTags(sticker, req.body.sticker.message);
    assignShareType(sticker);
    await sticker.save();
    console.log("sticker updated");
    res.send(sticker);
  } catch (err) {
    next(err);
  }
});

//delete a sticker
router.delete("/:stickerId/:userId", async (req, res, next) => {
  try {
    console.log("attempting delete");
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
