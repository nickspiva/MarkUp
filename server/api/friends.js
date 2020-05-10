const router = require("express").Router();
const User = require("../db/user");

//get all friends
router.get("/", async (req, res, next) => {
  try {
    res.json("in friends route");
  } catch (err) {
    next(err);
  }
});
//add a new friendship

//delete an existing friendship

module.exports = router;
