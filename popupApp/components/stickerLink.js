import React, { useState } from "react";
import moment from "moment";

const stickerLink = (props) => {
  const { sticker } = props;
  const { message, url, createdAt } = sticker;
  let shortUrl = url;

  const [archived, toggleArchiveStatus] = useState(sticker.archived);

  const toggleArchived = () => {
    if (!archived) {
      chrome.runtime.sendMessage({
        msg: "archiveSticker",
        id: sticker.id,
      });
    } else {
      chrome.runtime.sendMessage({
        msg: "unarchiveSticker",
        id: sticker.id,
      });
    }
    toggleArchiveStatus(!archived);
  };

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
        <div className="userName other">{sticker.user.userName}</div>
        <div className="blankSpace"></div>
        <div className="rightWrapper">
          <span class="timePassed other">
            {" "}
            {moment(sticker.createdAt).fromNow()}
          </span>
          <span onClick={toggleArchived} class="archived other">
            {" "}
            {archived ? " (hidden)" : " (visible)"}
          </span>
        </div>
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
