const Sequelize = require("sequelize");
const db = require("./database");

const Sticker = db.define("sticker", {
  message: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: { notEmpty: true },
  },
  height: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true, min: 1, max: 10000 },
  },
  width: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true, min: 1, max: 10000 },
  },
  xPos: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true, min: 1, max: 10000 },
  },
  yPos: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true, min: 1, max: 10000 },
  },
  url: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: { isUrl: true },
  },
  shareType: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: { isIn: [["withSelf", "withAFew", "withFriends", "withWorld"]] },
  },
  atTags: {
    type: Sequelize.ARRAY(Sequelize.TEXT),
  },
  hashTags: {
    type: Sequelize.ARRAY(Sequelize.TEXT),
  },
});

module.exports = Sticker;
