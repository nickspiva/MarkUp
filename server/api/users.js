const router = require("express").Router();

router.get("/", function (req, res, next) {
  res.json({ message: "in users router" });
});

module.exports = router;
