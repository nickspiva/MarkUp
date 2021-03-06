import React from "react";
import { Button } from "semantic-ui-react";
const md5 = require("md5");

/*
 * Search results is a functional react component that takes a props object
 * and returns a list of JSX friend divs and add buttons.
 *
 * @props.results, {arr}, arr of search results [{userName: "string", id: "int"}], ...)
 * @props.userId, {int}
 * @props.addFriend, {function}, add a friend
 * @props.yourFriends, {arr}, arr of your friends  [{id, userName, email, etc... more than needed}, ...]
 * @return JSX list of friends search results sorted.
 */

const SearchResults = (props) => {
  //add in add button next to each search result
  const { results, userId, addFriend, yourFriends } = props;

  //extract your friend IDs
  const yourFriendsIds = yourFriends.map((elem) => elem.id);
  let filteredResults = results;

  //filter out existing friends and user from the search results
  if (yourFriends.length) {
    filteredResults = results.filter((elem) => {
      if (yourFriendsIds.includes(elem.id) || elem.id === userId) {
        return false;
      }

      return true;
    });
  }

  //sort the search results
  if (filteredResults.length) {
    filteredResults.sort((a, b) => {
      if (a.userName > b.userName) {
        return 1;
      } else {
        return -1;
      }
    });
  }

  //If there are search results, for each of them...
  //display that friend's name and an add button, else
  //display no friends.
  return (
    <div>
      <h2>Search Results</h2>
      {results.length ? (
        <ul className="resultList">
          {filteredResults.map((elem) => (
            <li key={elem.id} className="resultItem">
              <div className="columnWrap start">
                <div className="friendName">{`${elem.userName}  `} </div>
              </div>
              <div className="columnWrap">
                <div className="imageWrapper">
                  <div className="tightWrapper">
                    <img
                      src={`https://www.gravatar.com/avatar/${md5(
                        elem.email
                      )}?s=65`}
                      className="profilePic"
                    />
                  </div>
                </div>
              </div>
              <div className="columnWrap end">
                <Button
                  className="updateButton"
                  onClick={() => addFriend(userId, elem.id)}
                >
                  Add Friend
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div style={{ color: "white" }}>No friends found</div>
      )}
    </div>
  );
};

export default SearchResults;
