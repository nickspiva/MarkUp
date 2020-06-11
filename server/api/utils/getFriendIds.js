const Friends = require("../../db/friends");

const getFriendIds = async (userId) => {
  const friends = await Friends.findAll({
    where: {
      userId,
    },
  });
  const friendIds = friends.map((elem) => elem.friendId);
  return friendIds;
};

module.exports = getFriendIds;
