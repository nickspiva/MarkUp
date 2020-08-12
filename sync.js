const { green, red } = require("chalk");
const db = require("./server/db/database");

const sync = async () => {
  try {
    await db.sync({ force: true });
  } catch (err) {
    console.log(red(err), err.status);
  }
};

module.exports = sync;
// If this module is being required from another module, then we just export the
// function, to be used as necessary. But it will run right away if the module
// is executed directly (e.g. `node seed.js` or `npm run seed`)
if (require.main === module) {
  sync()
    .then(() => {
      console.log(green("Seeding success!"));
      db.close();
    })
    .catch((err) => {
      console.error(red("Oh noes! Something went wrong!"));
      console.error(err);
      db.close();
    });
}
