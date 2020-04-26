const router = require("express").Router();

router.use("/users", require("./users"));
router.use("/stickers", require("./stickers"));

router.use(function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

module.exports = router;
