const router = require("express").Router();
const Sticker = require("../db/sticker");
const User = require("../db/user");

router.get("/ByFriends", async (req, res, next) => {
  try {
    //in the future would like to set up req.user
    //not sure how that works w/ extensions...
    const userId = req.body.userId;
    const friends = await Friends.findAll({
      where: {
        userId,
      },
    });
    const friendIds = friends.map((elem) => elem.friendId);

    let stickers = await user.getStickers();
    res.json("you're in tagged friends area");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
