const jwt = require("jsonwebtoken");
//check token is for correct user based on route params
const checkUser = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authorizedData) => {
    if (err) {
      console.log("err: ", err.message);
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
};

module.exports = checkUser;
