import React from "react";
import { Button } from "semantic-ui-react";

const Navbar = (props) => {
  const handleClick = (event) => {
    props.changePage(event.target.name);
  };
  return (
    <div>
      <Button name="home" onClick={handleClick}>
        Log-In
      </Button>
      <Button name="home" onClick={handleClick}>
        Sign-Up
      </Button>
      <Button name="myStickers" onClick={handleClick}>
        My Stickers
      </Button>
      <Button name="taggedStickers" onClick={handleClick}>
        Friend's Stickers
      </Button>
      <Button name="friends" onClick={handleClick}>
        Friends
      </Button>
      <Button name="profile" onClick={handleClick}>
        Profile
      </Button>
    </div>
  );
};

export default Navbar;
