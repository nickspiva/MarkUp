import React from "react";
import moment from "moment";

const stickerLink = (props) => {
  const { sticker } = props;
  const { message, url, createdAt } = sticker;
  let shortUrl = url;

  const openNewTab = (newUrl) => {
    chrome.tabs.create({ url: newUrl });
  };

  //process the url into a shorter string... clear out https
  if (url.length > 35) {
    shortUrl = url.slice(0, 35) + "...";
  }

  return (
    <div className="stickerContainer">
      <div className="stickerHeader">
        <div className="userName">
          {sticker.user.userName}{" "}
          <span class="timePassed"> {moment(sticker.createdAt).fromNow()}</span>
        </div>
        <div className="spacer"></div>
      </div>
      <div className="stickerLink" onClick={() => openNewTab(url)}>
        <div>{message} </div>
      </div>
      <div className="urlFooter" onClick={() => openNewTab(url)}>
        {shortUrl}
      </div>
    </div>
  );
};

export default stickerLink;
