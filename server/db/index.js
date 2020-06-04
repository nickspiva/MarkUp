const db = require("./database");
const Sticker = require("./sticker");
const User = require("./user");
const Friends = require("./friends");

// This is a great place to establish associations between your models
// (https://sequelize-guides.netlify.com/association-types/).
// Example:
//
// Puppy.belongsTo(Owner)

Sticker.belongsTo(User);
User.hasMany(Sticker);
User.belongsToMany(User, { as: "friend", through: Friends });

module.exports = {
  // Include your models in this exports object as well!
  db,
  Sticker,
  User,
};
