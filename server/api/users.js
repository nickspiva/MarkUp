const router = require("express").Router();
const User = require("../db/user");
const Sequelize = require("sequelize");
const pickPropsFromObj = require("./utils/pickPropsFromObj");
const bcrypt = require("../bcryptExport").bcrypt;
const saltRounds = 10;
const checkToken = require("./utils/checkToken");

const confirmUserInfo = async (req, res, next) => {
  console.log("confirm user info");
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({
      where: {
        userName: userName,
      },
    });
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

        //attach user and pass to next
        req.body.user = user;
        next();
      }
    });
  } catch (err) {
    next(err);
  }
};

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
        `${query}%`
      ),
    },
  });
  res.json(potentialFriends);
});

//update userinfo
router.put("/", confirmUserInfo, async (req, res, next) => {
  try {
    console.log("in backend update user");
    const userData = pickPropsFromObj(
      ["updateField", "newFieldContent"],
      req.body
    );
    console.log("userData:", userData);
    console.log("req: ", req.body);

    if (userData.updateField === "password") {
      bcrypt.hash(userData.newFieldContent, saltRounds, async function (
        err,
        hash
      ) {
        if (err) {
          throw err;
        }
        console.log("hash: ", await hash);
        const newPassword = await hash;
        req.body.user["password"] = newPassword;
        await req.body.user.save();
        res.sendStatus(200);
      });
    } else {
      req.body.user[userData.updateField] = userData.newFieldContent;
      await req.body.user.save();
      res.sendStatus(200);
    }
  } catch (err) {
    next(err);
  }
});

//create user; POST /users
router.post("/", async (req, res, next) => {
  try {
    const userData = pickPropsFromObj(
      ["userName", "password", "email"],
      req.body
    );

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
