const router = require("express").Router();
const Sticker = require("../db/sticker");
const User = require("../db/user");

//get all stickers
router.get("/", function (req, res, next) {
  try {
    res.json(Sticker.findAll());
  } catch (err) {
    next(err);
  }
});

//get all my stickers

//get all the stickers that my friends tagged me in

//picks the array of props from an object and doesn't assign keys to the returned object
//that are falsey
const pickPropsFromObj = (props, obj) => {
  return props.reduce((acc, prop) => {
    const value = obj[prop];
    if (obj[prop]) {
      return { ...acc, [prop]: value };
    }
    return acc;
  }, {});
};

//add a sticker to the database
router.post("/", async (req, res, next) => {
  try {
    const stickerData = pickPropsFromObj(
      ["message", "height", "width", "xPos", "yPos", "url"],
      req.body
    );
    const sticker = await Sticker.create(stickerData);
    //currently hardcoded the user pk, will need to update
    const user = await User.findbyPk(1);
    sticker.setUser(user);
    res.json(sticker);
  } catch (err) {
    next(err);
  }
});

//delete a sticker

module.exports = router;
