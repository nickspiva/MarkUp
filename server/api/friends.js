const router = require("express").Router();
const User = require("../db/user");
const Friends = require("../db/friends");
const Sequelize = require("sequelize");

//get all friend ID's
router.get("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const friends = await Friends.findAll({
      where: {
        userId,
      },
    });
    const friendIds = friends.map((elem) => elem.friendId);
    const friendUsers = await User.findAll({
      attributes: { exclude: ["password"] },
      where: {
        id: {
          [Sequelize.Op.in]: friendIds,
        },
      },
    });
    res.json(friendUsers);
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
    res.json(friend);
  } catch (err) {
    next(err);
  }
});

//delete an existing friendship
router.delete("/", async (req, res, next) => {
  try {
    const friendship = await Friends.findOne({
      where: {
        userId: req.body.userId,
        friendId: req.body.friendId,
      },
    });
    await friendship.destroy();
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
