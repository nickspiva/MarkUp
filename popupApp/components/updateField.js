import React from "react";
import { Button } from "semantic-ui-react";

const UpdateField = (props) => {
  const {
    thisField,
    editField,
    handleChange,
    cancelEdit,
    updateUserInfo,
    oldPassword,
    handleEditClick,
  } = props;

  if (editField === thisField) {
    return (
      <div>
        <div>Change {thisField}: </div>
        <div>Old Password:</div>
        <input
          type="text"
          label="oldPassword"
          name="oldPassword"
          onChange={handleChange}
          value={oldPassword}
        />
        <div>New {thisField}:</div>
        <input
          type="text"
          label={thisField}
          name={thisField}
          onChange={handleChange}
          value={thisField}
        />
        <Button
          onClick={() =>
            updateUserInfo(
              { thisfield },
              this.state.oldPassword,
              this.state.newPassword
            )
          }
          id={thisField}
        >
          Update
        </Button>
        <Button
          onClick={() => {
            cancelEdit();
          }}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div>{thisField}: </div>
      <div>
        <span>Hidden</span>
      </div>
      <Button onClick={handleEditClick} id={thisField}>
        Edit
      </Button>
    </div>
  );
};

export default UpdateField;
