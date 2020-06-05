import React from "react";

const stickerLink = (props) => {
  const { sticker } = props;
  const { message, url, createdAt } = sticker;
  let dateCreated = new Date(Date.parse(createdAt));

  const openNewTab = (newUrl) => {
    chrome.tabs.create({ url: newUrl });
  };

  return (
    <div
      style={{
        border: "solid black",
        background: "lightblue",
        backgroudColor: "lightblue",
        margin: "10px",
      }}
      onClick={() => openNewTab(url)}
    >
      <div>Message: {message} </div>
      <div>URL: {url}</div>
      <div>
        Created: {dateCreated.getMonth()}/{dateCreated.getDate()} @{" "}
        {dateCreated.getTime()}
      </div>
    </div>
  );
};

export default stickerLink;
