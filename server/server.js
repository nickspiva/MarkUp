const express = require("express");
const path = require("path");
const volleyball = require("volleyball");
const bodyParser = require("body-parser");
const compression = require("compression");
const { db } = require("./db/index");
const session = require("express-session");
const passport = require("passport");
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sessionStore = new SequelizeStore({ db });
// if (process.env.NODE_ENV !== "production") require("../secrets");
const PORT = 1337;

const app = express();

//passport setup
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.models.user.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const createApp = () => {
  //middleware setup
  app.use(volleyball); //logging
  app.use(express.urlencoded({ extended: true })); //body-parsing
  app.use(express.static(path.join(__dirname, "./static.html")));
  app.use(bodyParser.json()); //body-parsing
  app.use(compression()); //compression middleware

  app.use("/api", require("./api"));

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./static.html"));
  });

  //error handling
  app.use(function (err, req, res, next) {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || "Internal server error");
  });
};

//this will be imported and used by startServer.js
module.exports = app;

const syncDb = () => db.sync();

const startListening = () => {
  const server = app.listen(process.env.PORT || PORT, () =>
    console.log(`studiously serving silly sounds on port ${PORT}`)
  );
};

async function bootApp() {
  // await sessionStore.sync();
  await syncDb();
  await createApp();
  await startListening();
}

if (require.main === module) {
  bootApp();
} else {
  createApp();
}
