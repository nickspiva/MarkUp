const router = require("express").Router();
const User = require("../db/user");
const bcrypt = require("bcrypt");

//get
router.get("/", async (req, res, next) => {
  try {
    res.json("in login route");
  } catch (err) {
    next(err);
  }
});

//login
router.post("/", async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    //console.log("username / pword: ", userName, password);
    const user = await User.findOne({
      where: {
        userName: userName,
      },
    });

    console.log("user: ", user);
    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        throw err;
      }
      if (result) {
        res.json(user);
      } else {
        res.json("wrong password");
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
