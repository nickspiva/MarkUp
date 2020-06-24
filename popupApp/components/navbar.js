import React from "react";
import { Button } from "semantic-ui-react";

const Navbar = (props) => {
  const handleClick = (event) => {
    props.changePage(event.target.name);
  };

  const pages = ["myStickers", "taggedStickers", "friends", "profile"];
  return (
    <div>
      {
        <Button
          name="login"
          onClick={handleClick}
          className={props.page === "login" ? "active" : "passive"}
        >
          {props.loggedIn ? "logout" : "login"}
        </Button>
      }
      {!props.loggedIn && (
        <Button
          name="signup"
          onClick={handleClick}
          className={props.page === "signup" ? "active" : "passive"}
        >
          sign-up
        </Button>
      )}
      {pages.map((page) => {
        // console.log("page: ", page);
        // console.log("active? ", page === props.page);
        return (
          <Button
            name={page}
            onClick={handleClick}
            className={props.page === page ? "active" : "passive"}
          >
            {page}
          </Button>
        );
      })}
    </div>
  );
};

export default Navbar;
