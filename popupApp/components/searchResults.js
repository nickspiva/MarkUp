import React from "react";
import { Icon, Button } from "semantic-ui-react";
import axios from "axios";
const ngrokUrl = require("./ngrok");

const SearchResults = (props) => {
  //add in add button next to each search result
  const { results, searched, userId, addFriend } = props;
  };

  return (
    <div>
      <h3>Search Results</h3>
      {results.length ? (
        <ul>
          {results.map((elem) => (
            <li
              key={elem.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "5px",
                margin: "5px",
              }}
            >
              <div>{`${elem.userName}  `} </div>
              <Button onClick={() => addFriend(userId, elem.id)}>+ add</Button>
            </li>
          ))}
        </ul>
      ) : (
        <div>No friends found</div>
      )}
    </div>
  );
};

export default SearchResults;
