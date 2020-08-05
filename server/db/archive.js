const Sequelize = require("sequelize");
const db = require("./database");

const Archive = db.define("archive", {
  type: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = Archive;
