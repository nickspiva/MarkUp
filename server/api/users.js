const router = require("express").Router();
const User = require("../db/user");
const Sequelize = require("sequelize");
const pickPropsFromObj = require("./utils/pickPropsFromObj");
const bcrypt = require("bcrypt");
const saltRounds = 10;

//get all users; GET /users
router.get("/", function (req, res, next) {
  res.json({ message: "in users router" });
});

router.post("/friendSearch", async function (req, res, next) {
  const query = req.body.query.toLowerCase();
  const potentialFriends = await User.findAll({
    attributes: ["userName", "id"],
    where: {
      userName: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("userName")),
        "LIKE",
        `%${query}%`
      ),
    },
  });
  res.json(potentialFriends);
});

//update userinfo
router.put("/", async (req, res, next) => {
  try {
    console.log("in backend update user");
    const userData = pickPropsFromObj(
      ["userName", "password", "userId"],
      req.body
    );
    const user = await User.findByPk(userData.userId);
    if (userData.userName) {
      user.userName = userData.userName;
    }
    if (userData.password) {
      user.password = userData.password;
    }
    await user.save();
    console.log("user updated");
    res.json(user);
  } catch (err) {
    next(err);
  }
});

//create user; POST /users
router.post("/", async (req, res, next) => {
  try {
    const userData = pickPropsFromObj(["userName", "password"], req.body);

    bcrypt.hash(userData.password, saltRounds, async function (err, hash) {
      if (err) {
        throw err;
      }
      console.log("hash: ", await hash);
      userData.password = await hash;
      const user = await User.create(userData);
      res.json(user);
    });
    //currently hardcoded the user pk, will need to update
  } catch (err) {
    next(err);
  }
});

//TO BE DEVELOPED
//get single user; GET /users/:id
//update user; PUT /users/:id
//delete user; DELETE /users/:id

module.exports = router;
