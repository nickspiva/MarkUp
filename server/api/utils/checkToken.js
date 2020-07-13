//check req has token
const checkToken = (req, res, next) => {
  //console.log("checking token: ", req.headers);
  const header = req.headers["authorization"];
  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    const token = bearer[1];
    req.token = token;
    //console.log("token: ", token);
    next();
  } else {
    res.sendStatus(403);
  }
};

module.exports = checkToken;
