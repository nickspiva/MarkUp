const { green, red } = require("chalk");
const db = require("./server/db/database");
const { Sticker, User } = require("./server/db");

const seedUsers = [
  { userName: "Nicky", password: "test1" },
  { userName: "Will", password: "test2" },
  { userName: "Jack", password: "test3" },
];

const seedStickers = [
  {
    message: "Numero Uno",
    height: 150,
    width: 250,
    xPos: 300,
    yPos: 400,
    url: "https://www.youneedabudget.com/",
  },
  {
    message: "Second's best",
    height: 150,
    width: 250,
    xPos: 300,
    yPos: 400,
    url: "https://questionablecontent.net/",
  },
  {
    message: "Hairy chest",
    height: 150,
    width: 250,
    xPos: 300,
    yPos: 400,
    url: "https://www.popsci.com/",
  },
];

const seed = async () => {
  try {
    await db.sync({ force: true });

    const [user1, user2, user3] = await Promise.all(
      seedUsers.map((user) => User.create(user))
    );

    // console.log("user1 proto:", user1.__proto__);

    const [sticker1, sticker2, sticker3] = await Promise.all(
      seedStickers.map((sticker) => Sticker.create(sticker))
    );
    await Promise.all([
      sticker1.setUser(user1),
      sticker2.setUser(user2),
      sticker3.setUser(user3),
    ]);
  } catch (err) {
    console.log(red(err));
  }
};

module.exports = seed;
// If this module is being required from another module, then we just export the
// function, to be used as necessary. But it will run right away if the module
// is executed directly (e.g. `node seed.js` or `npm run seed`)
if (require.main === module) {
  seed()
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
