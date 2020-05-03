import React from "react";
import { Button } from "semantic-ui-react";

const UserProfile = (props) => {
  const handleClick = () => {
    props.changePage("home");
  };
  return (
    <div>
      <h2>User Profile</h2>
    </div>
  );
};

export default UserProfile;
