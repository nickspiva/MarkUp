const router = require("express").Router();
const Sticker = require("../db/sticker");
const { User, Archive } = require("../db/index");
const Sequelize = require("sequelize");
const getFriendIds = require("./utils/getFriendIds");
const checkToken = require("../api/utils/checkToken");
const checkUser = require("../api/utils/checkUser");
const Friends = require("../db/friends");

//fetch user's archived stickers
router.get("/:userId", async (req, res, next) => {
  try {
    console.log("in archive route");
    res.json("in the archive");
  } catch (err) {
    next(err);
  }
});

//archive a sticker
router.post("/:userId/:stickerId", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);
    const sticker = await Sticker.findByPk(req.params.stickerId);
    console.log("sticker: ", sticker.__proto__);
    sticker.addArchived(user);
    res.json({ user, sticker });
  } catch (err) {
    next(err);
  }
});

//un-archive a sticker
router.delete("/:userId/:stickerId", async (req, res, next) => {
  console.log("deleting archived rel");
  try {
    const archivedSticker = await Archive.findOne({
      where: {
        userId: req.params.userId,
        stickerId: req.params.stickerId,
      },
    });
    await archivedSticker.destroy();
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

router.get(
  "/ByFriends/:userId",
  checkToken,
  checkUser,
  async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const user = await User.findByPk(req.params.userId);
      const friendIds = await getFriendIds(userId);
      //gets all friends stickers where the user is tagged
      const taggedStickers = await Sticker.findAll({
        where: {
          userId: friendIds,
          atTags: {
            [Sequelize.Op.contains]: [user.userName],
          },
        },
        include: {
          model: User,
          attributes: ["userName"],
        },
      });
      res.json(taggedStickers);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/ByRandos/:userId",
  checkToken,
  checkUser,
  async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const user = await User.findByPk(userId);
      const friendIds = await getFriendIds(userId);
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
  }
);

module.exports = router;
