const router = require("express").Router();
const Sticker = require("../db/sticker");
const { User, Archive } = require("../db/index");
const Sequelize = require("sequelize");
const getFriendIds = require("./utils/getFriendIds");
const checkToken = require("../api/utils/checkToken");
const checkUser = require("../api/utils/checkUser");

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
          attributes: ["userName", "email"],
        },
      });

      const archivedStickers = await Archive.findAll({
        where: {
          userId: req.params.userId,
        },
      });
      const archivedIds = archivedStickers.map((elem) => elem.stickerId);
      taggedStickers.forEach((sticker) => {
        if (archivedIds.includes(sticker.id)) {
          sticker.dataValues.archived = true;
        } else {
          sticker.dataValues.archived = false;
        }
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
