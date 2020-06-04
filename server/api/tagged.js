const router = require("express").Router();
const Sticker = require("../db/sticker");
const User = require("../db/user");
const Friends = require("../db/friends");
const Sequelize = require("sequelize");

router.get("/ByFriends", async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const user = await User.findByPk(userId);
    const friends = await Friends.findAll({
      where: {
        userId,
      },
    });
    const friendIds = friends.map((elem) => elem.friendId);
    //gets all friends stickers where the user is tagged
    const taggedStickers = await Sticker.findAll({
      where: {
        userId: friendIds,
        atTags: {
          [Sequelize.Op.contains]: [user.userName],
        },
      },
    });

    res.json(taggedStickers);
  } catch (err) {
    next(err);
  }
});

router.get("/ByRandos", async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const user = await User.findByPk(userId);
    const friends = await Friends.findAll({
      where: {
        userId,
      },
    });
    const friendIds = friends.map((elem) => elem.friendId);
    //gets all friends stickers where the user is tagged
    const taggedStickers = await Sticker.findAll({
      where: {
        userId: {
          [Sequelize.Op.notIn]: friendIds,
        },
        atTags: {
          [Sequelize.Op.contains]: [user.userName],
        },
      },
    });

    res.json(taggedStickers);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
