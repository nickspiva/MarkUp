const Sequelize = require("sequelize");
const db = require("./database");

const Friends = db.define("friends", {
  type: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = Friends;
