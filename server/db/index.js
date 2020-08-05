const db = require("./database");
const Sticker = require("./sticker");
const User = require("./user");
const Friends = require("./friends");
const Archive = require("./archive");

// This is a great place to establish associations between your models
// (https://sequelize-guides.netlify.com/association-types/).
// Example:
//
// Puppy.belongsTo(Owner)

Sticker.belongsTo(User);
User.hasMany(Sticker);
User.belongsToMany(User, { as: "friend", through: Friends });
Sticker.belongsToMany(User, { as: "archived", through: Archive });

module.exports = {
  // Include your models in this exports object as well!
  db,
  Sticker,
  User,
  Archive,
};
