const router = require("express").Router();
const User = require("../db/user");
const Sequelize = require("sequelize");

//get all users; GET /users
router.get("/", function (req, res, next) {
  res.json({ message: "in users router" });
});

router.post("/friendSearch", async function (req, res, next) {
  const query = req.body.query.toLowerCase();
  console.log("req.body.query: ", query);
  const potentialFriends = await User.findAll({
    attributes: ["userName", "id"],
    where: {
      // userName: {
      //   [Sequelize.Op.like]: `%${query}%`,
      // },
      userName: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("userName")),
        "LIKE",
        `%${query}%`
      ),
    },
  });
  res.json(potentialFriends);
});

//picks the array of props from an object and doesn't assign keys to the returned object
//that are falsey
const pickPropsFromObj = (props, obj) => {
  return props.reduce((acc, prop) => {
    const value = obj[prop];
    if (obj[prop]) {
      return { ...acc, [prop]: value };
    }
    return acc;
  }, {});
};

//create user; POST /users
router.post("/", async (req, res, next) => {
  try {
    const userData = pickPropsFromObj(["userName", "password"], req.body);
    const user = await User.create(userData);
    //currently hardcoded the user pk, will need to update
    res.json(user);
  } catch (err) {
    next(err);
  }
});

//create user; POST /users

//get single user; GET /users/:id

//update user; PUT /users/:id
//delete user; DELETE /users/:id

module.exports = router;
