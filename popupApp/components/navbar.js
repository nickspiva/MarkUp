import React from "react";
import { Button } from "semantic-ui-react";

const Navbar = (props) => {
  const handleClick = (event) => {
    props.changePage(event.target.name);
  };
  const pages = ["feed", "my stickers", "friends", "profile"];
  return (
    <div id="navbar">
      {/* if logged out, render login button first */}
      {!props.loggedIn && (
        <Button
          name="login"
          onClick={handleClick}
          className={`${
            props.page === "login" ? "active" : "passive"
          } navButton`}
        >
          {props.loggedIn ? "logout" : "login"}
        </Button>
      )}
      {!props.loggedIn && (
        <Button
          name="signup"
          onClick={handleClick}
          className={`${
            props.page === "signup" ? "active" : "passive"
          } navButton`}
        >
          sign-up
        </Button>
      )}
      {props.loggedIn &&
        pages.map((page) => {
          return (
            <Button
              name={page}
              onClick={handleClick}
              className={`${
                props.page === page ? "active" : "passive"
              } navButton`}
            >
              {page}
            </Button>
          );
        })}
      {/* if logged in, render logout button last */}
      {props.loggedIn && (
        <Button
          name="login"
          onClick={handleClick}
          className={`${
            props.page === "login" ? "active" : "passive"
          } navButton`}
        >
          {props.loggedIn ? "logout" : "login"}
        </Button>
      )}
    </div>
  );
};

export default Navbar;
