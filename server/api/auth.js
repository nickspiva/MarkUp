const router = require("express").Router();
const User = require("../db/user");
const jwt = require("jsonwebtoken");
const checkUser = require("./utils/checkUser");
const checkToken = require("./utils/checkToken");
require("dotenv").config();

router.get("/tokenDateCheck", checkToken, async (req, res, next) => {
  try {
    jwt.verify(req.token, process.env.JWT_SECRET, (err, authorizedData) => {
      if (err) {
        //if token is expired communicate that back to app
        if (err.message == "jwt expired") {
          // res.status(401);
          res.json("token expired");
        } else {
          //some other weird token error
          res.sendStatus(401);
        }
      } else {
        res.json("token valid");
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
