const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/users", require("./users"));
router.use("/stickers", require("./stickers"));
router.use("/friends", require("./friends"));
router.use("/login", require("./login"));

router.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

module.exports = router;
