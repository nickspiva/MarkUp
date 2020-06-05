import React from "react";

const stickerLink = (props) => {
  const { sticker } = props;
  const { message, url, createdAt } = sticker;
  let dateCreated = new Date(Date.parse(createdAt));

  return (
    <div
      style={{
        border: "solid black",
        backgroudColor: "lightblue",
        margin: "10px",
      }}
    >
      <div>Message: {message} </div>
      <div>URL: {url}</div>
      <div>Created: {dateCreated.getDate()}</div>
    </div>
  );
};

export default stickerLink;
