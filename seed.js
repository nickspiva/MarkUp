const { green, red } = require("chalk");
const db = require("./server/db/database");
const { Sticker, User } = require("./server/db");
const faker = require("faker/locale/en_US");

const numOfUsers = 4;
const numOfStickers = 3;
const maxFriends = 2;
const minFriends = 1;

const makeUser = () => {
  return {
    userName: faker.internet.userName(),
    password: "123",
    email: faker.internet.email(),
    imageUrl: faker.image.imageUrl(),
  };
};

const makeSticker = () => {
  return {
    message: faker.hacker.phrase(),
    height: Math.floor(Math.random() * 300 + 100) + "px",
    width: Math.floor(Math.random() * 300 + 200) + "px",
    xPos: Math.floor(Math.random() * 300 + 200) + "px",
    yPos: Math.floor(Math.random() * 300 + 200) + "px",
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

    //add admin user seed
    seedUsers.push({
      userName: "Nicky",
      password: "123",
      email: "nick@gmail.com",
      imageUrl:
        "https://kajabi-storefronts-production.global.ssl.fastly.net/kajabi-storefronts-production/blogs/1222/images/Vmi4xm56TPGDya2Xw60g_Nicky3_1_.png",
    });
    seedUsers.push({
      userName: "Courtney",
      password: "123",
      email: "courtney@gmail.com",
      imageUrl:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Ftwitter.com%2Fcourtneyldevin&psig=AOvVaw1pFyzCMzCWPavcl8qIgxJN&ust=1593648067318000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCPjsoenfquoCFQAAAAAdAAAAABAD",
    });

    //seed users
    const users = await Promise.all(seedUsers.map((user) => User.create(user)));

    //create random stickers to seed
    const seedStickers = [];
    for (let i = 0; i < numOfStickers; i++) {
      let sticker = makeSticker();
      let taggedSticker = addTags(sticker, seedUserNames);
      taggedSticker = addTags(taggedSticker, seedUserNames);
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
