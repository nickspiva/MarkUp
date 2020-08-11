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
  imageUrl: {
    type: Sequelize.STRING,
    validate: {
      isUrl: true,
    },
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true,
    },
  },
  autoLoad: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  dailyEmails: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = User;
