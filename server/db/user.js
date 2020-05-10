const Sequelize = require("sequelize");
const db = require("./database");

const User = db.define("user", {
  userName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
});

module.exports = User;
