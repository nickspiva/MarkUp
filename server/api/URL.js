const router = require("express").Router();
const User = require("../db/user");
const Sticker = require("../db/sticker");

//get all stickers from this URL that this user has made
router.get("/", function (req, res, next) {
  try {
    const data = req.body;
    res.json(
      Sticker.findAll({
        where: {
          url: data.url,
        },
      })
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
