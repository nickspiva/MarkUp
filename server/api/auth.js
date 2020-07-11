const router = require("express").Router();
const User = require("../db/user");
const jwt = require("jsonwebtoken");

const checkToken = (req, res, next) => {
  console.log("checking token: ", req.headers);
  const header = req.headers["authorization"];
  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    const token = bearer[1];

    req.token = token;
    next();
  } else {
    res.sendStatus(403);
  }
};

const checkUser = (req, res, next) => {
  console.log("checking user");
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authorizedData) => {
    if (err) {
      console.log("ERROR: could not connect to protected route, no token");
      res.sendStatus(403);
    } else {
      console.log("user matches!");
      req.user = authorizedData.user;
      next();
    }
  });
};

router.get("/me", checkToken, checkUser, async (req, res, next) => {
  try {
    console.log("token fetch user");
    res.json(req.user);
  } catch (err) {
    next(err);
  }
  //decode the jwt, send back the username and id
});

module.exports = router;
