const router = require("express").Router();
const User = require("../db/user");
const Sticker = require("../db/sticker");
const { Op } = require("sequelize");
const getFriendIds = require("./utils/getFriendIds");

//get all relevant stickers for this user at this url
router.get("/:url/:userId", async function (req, res, next) {
  try {
    const decodedUrl = decodeURIComponent(req.params.url);
    const userId = req.params.userId;
    const user = await User.findByPk(req.params.userId);
    const friendIds = await getFriendIds(userId);

    //get (1) my stickers @ this url; (2) my friend's shared stickers @this url
    //(3) my friends stickers with me tagged @ this url, & (4) public stickers @ this url
    const urlStickers = await Sticker.findAll({
      where: {
        [Op.or]: [
          { [Op.and]: [{ url: decodedUrl }, { userId: userId }] },
          {
            [Op.and]: [
              { url: decodedUrl },
              { userId: friendIds },
              { shareType: "withFriends" },
            ],
          },
          {
            [Op.and]: [
              {
                url: decodedUrl,
              },
              { userId: friendIds },
              { shareType: "withAFew" },
              { atTags: { [Op.contains]: [user.userName] } },
            ],
          },
          { [Op.and]: [{ url: decodedUrl }, { shareType: "withWorld" }] },
        ],
      },
    });
    res.json(urlStickers);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
