const router = require("express").Router();
const User = require("../db/user");
const bcrypt = require("../bcryptExport").bcrypt;
const jwt = require("jsonwebtoken");
const md5 = require("md5");
require("dotenv").config();

/*
 * Handles users attempting to log in w/ encryption and jwt creation.
 * @param {Object}, req, contains the username and password submitted by the user.
 * FYI req is structured like: req = {body: {username: xx, password: xx}}
 */
router.post("/", async (req, res, next) => {
  try {
    console.log("req.body: ", req.body);
    //From the username and password submitted, find a user in the db
    const { userName, password } = req.body;
    const user = await User.findOne({
      where: {
        userName: userName,
      },
    });
    //compare the encrypted db password with the submitted password
    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        console.log("in bcrypt compare some error");
        throw err;
      }
      if (!result) {
        console.log("in bcrypt compare wrong password");
        res.json("wrong password");
      } else {
        console.log("in bcrypt compare correct password");
        //build the response object with only basic safe to send user info
        const response = {
          user: {
            userName: user.userName,
            id: user.id,
            emailHash: md5(user.email),
            email: user.email,
            autoLoad: user.autoLoad,
          },
        };
        //also build a jwt token and attach it to the reponse to be sent
        jwt.sign(
          { user },
          process.env.JWT_SECRET,
          { expiresIn: "1d" },
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
