const jwt = require("jsonwebtoken");
//check token is for correct user based on route params
const checkUser = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authorizedData) => {
    if (err) {
      throw err;
    } else if (authorizedData.user.id !== parseInt(req.params.userId)) {
      res.status(403).send("wrong user");
    } else {
      //user matches
      next();
    }
  });
};

module.exports = checkUser;
