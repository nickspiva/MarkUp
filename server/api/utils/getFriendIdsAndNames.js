const { User, Friends } = require("../../db/index");

const getFriendIdsAndNames = async (userId) => {
  const friends = await Friends.findAll({
    where: {
      userId,
    },
  });
  console.log("friends: ", friends);
  const friendIds = friends.map((elem) => elem.friendId);
  return friendIds;
};

module.exports = getFriendIdsAndNames;
