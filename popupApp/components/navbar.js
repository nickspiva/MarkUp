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
        <button
          name="login"
          onClick={handleClick}
          className={`${
            props.page === "login" ? "active" : "passive"
          } navButton`}
        >
          {props.loggedIn ? "logout" : "login"}
        </button>
      )}
      {!props.loggedIn && (
        <button
          name="signup"
          onClick={handleClick}
          className={`${
            props.page === "signup" ? "active" : "passive"
          } navButton`}
        >
          sign-up
        </button>
      )}
      {props.loggedIn &&
        pages.map((page) => {
          return (
            <button
              name={page}
              onClick={handleClick}
              className={`${
                props.page === page ? "active" : "passive"
              } navButton`}
            >
              {page}
            </button>
          );
        })}
      {/* if logged in, render logout button last */}
      {props.loggedIn && (
        <button
          name="login"
          onClick={handleClick}
          className={`${
            props.page === "login" ? "active" : "passive"
          } navButton`}
        >
          {props.loggedIn ? "logout" : "login"}
        </button>
      )}
    </div>
  );
};

export default Navbar;
