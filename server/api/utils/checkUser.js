const jwt = require("jsonwebtoken");
require("dotenv").config();
//check token is for correct user based on route params
const checkUser = (req, res, next) => {
  try {
    jwt.verify(req.token, process.env.JWT_SECRET, (err, authorizedData) => {
      if (err) {
        //if token is expired communicate that back to app
        if (err.message == "jwt expired") {
          res.status(401);
          res.json("token expired");
        }
      } else if (authorizedData.user.id !== parseInt(req.params.userId)) {
        res.status(403).send("wrong user");
      } else {
        //user matches
        next();
      }
    });
  } catch (err) {
    console.log("catching error: ", err);
  }
};

module.exports = checkUser;
