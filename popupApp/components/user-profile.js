import React from "react";
import { Button } from "semantic-ui-react";

const UserProfile = (props) => {
  const handleClick = () => {
    props.changePage("home");
  };
  return (
    <div>
      <h1>User Profile</h1>
      <Button onClick={handleClick}>Go to Login</Button>
    </div>
  );
};

export default UserProfile;
