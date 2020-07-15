const router = require("express").Router();
const User = require("../db/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/*
 * Handles users attempting to log in w/ encryption and jwt creation.
 * @param {Object}, req, contains the username and password submitted by the user.
 * FYI req is structured like: req = {body: {username: xx, password: xx}}
 */
router.post("/", async (req, res, next) => {
  try {
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
        throw err;
      }
      if (!result) {
        res.json("wrong password");
      } else {
        //build the response object with only basic safe to send user info
        const response = {
          user: {
            userName: user.userName,
            id: user.id,
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
