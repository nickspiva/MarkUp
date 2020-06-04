const router = require("express").Router();
const User = require("../db/user");
const Friends = require("../db/friends");

//get all friend ID's
router.get("/", async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const friends = await Friends.findAll({
      where: {
        userId,
      },
    });
    const friendIds = friends.map((elem) => elem.friendId);
    res.json(friendIds);
  } catch (err) {
    next(err);
  }
});

//add a new friendship
router.post("/", async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const friendId = req.body.friendId;
    const user = await User.findByPk(userId);
    const friend = await User.findByPk(friendId);
    user.addFriend(friend);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

//delete an existing friendship

module.exports = router;
