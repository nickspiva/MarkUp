const { green, red } = require("chalk");
const db = require("./server/db/database");
const { Sticker, User } = require("./server/db");
const faker = require("faker/locale/en_US");

const numOfUsers = 10;
const numOfStickers = 20;
const maxFriends = 4;
const minFriends = 1;

const makeUser = () => {
  return { userName: faker.internet.userName(), password: "123" };
};

const makeSticker = () => {
  return {
    message: faker.hacker.phrase(),
    height: Math.floor(Math.random() * 300 + 100),
    width: Math.floor(Math.random() * 300 + 200),
    xPos: Math.floor(Math.random() * 300 + 200),
    yPos: Math.floor(Math.random() * 300 + 200),
    url: faker.internet.url(),
    shareType: "withFriends",
    atTags: [],
    hashTags: [],
  };
};

const randArrElem = (arr) => {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
};

const addTags = (sticker, atTagArr) => {
  const atTag = randArrElem(atTagArr);
  sticker.message = sticker.message + " @" + atTag;
  if (!sticker.atTags.length) {
    sticker.atTags = [atTag];
  } else {
    sticker.atTags = [...sticker.atTags, atTag];
  }
  return sticker;
};

const seed = async () => {
  try {
    await db.sync({ force: true });

    //create random users to seed
    const seedUsers = [];
    for (let i = 0; i < numOfUsers; i++) {
      seedUsers.push(makeUser());
    }

    //get list of userNames for seeding @tags
    const seedUserNames = seedUsers.map((elem) => elem.userName);

    //seed users
    const users = await Promise.all(seedUsers.map((user) => User.create(user)));

    //create random stickers to seed
    const seedStickers = [];
    for (let i = 0; i < numOfStickers; i++) {
      let sticker = makeSticker();
      let taggedSticker = addTags(sticker, seedUserNames);
      taggedSticker = addTags(taggedSticker, seedUserNames);
      // console.log("taggedSticker: ", taggedSticker);
      seedStickers.push(taggedSticker);
    }

    //seed stickers
    const stickers = await Promise.all(
      seedStickers.map((sticker) => Sticker.create(sticker))
    );

    const associatedStickerPromises = stickers.map((sticker) => {
      return Promise.resolve(sticker.setUser(randArrElem(users)));
    });

    //associate stickers with users
    await Promise.all(associatedStickerPromises);

    //seed friends
    //set up array of objects with each user and their friends
    const friendsArr = users.map((elem) => {
      let friendArr = [];
      let friendsNames = [];
      const numberOfFriends = Math.floor(
        Math.random() * maxFriends + minFriends
      );

      for (let i = 0; i < numberOfFriends; i++) {
        const thisFriend = randArrElem(users);
        //confirm they aren't friending themself and they aren't duplicating existing friend
        if (
          thisFriend.userName !== elem.userName &&
          !friendsNames.includes(thisFriend.userName)
        ) {
          friendArr.push(thisFriend);
          friendsNames.push(thisFriend.userName);
        }
      }
      return {
        user: elem,
        friends: friendArr,
      };
    });

    //convert to promises of adding friends
    let friendsPromiseArr = friendsArr.map((elem) => {
      return elem.friends.map((friend) => {
        return Promise.resolve(elem.user.addFriend(friend));
      });
    });

    //resolve all friend add promises on flattened array
    let friendsFlatPromised = friendsPromiseArr.flat();
    await Promise.all(friendsFlatPromised);
  } catch (err) {
    console.log(red(err), err.status);
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
