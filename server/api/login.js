const router = require("express").Router();
const User = require("../db/user");

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
        password: password,
      },
    });
    //console.log("user: ", user);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
