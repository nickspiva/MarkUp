const router = require("express").Router();
const User = require("../db/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    const basicInfo = {};
    console.log("user: ", user);
    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        throw err;
      }
      if (!result) {
        res.json("wrong password");
      } else {
        console.log("secret", process.env.JWT_SECRET);
        const response = {
          user: {
            userName: user.userName,
            id: user.id,
          },
        };
        jwt.sign(
          { user },
          process.env.JWT_SECRET,
          { expiresIn: "1h" },
          (err, token) => {
            if (err) {
              console.log(err);
            }
            response.token = token;
            res.json(response);
          }
        );
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
