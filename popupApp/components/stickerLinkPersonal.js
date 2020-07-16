import React from "react";
import moment from "moment";

const stickerLinkPersonal = (props) => {
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

  const correctDate = moment(createdAt);
  const displayDate = correctDate.calendar();

  return (
    <div className="stickerContainer">
      <div className="stickerHeader">
        <div className="userName">
          <span class="timePassed"> {moment(sticker.createdAt).fromNow()}</span>
        </div>
        <div className="spacer"></div>
      </div>
      <div className="stickerLink" onClick={() => openNewTab(url)}>
        <div>{message} </div>
      </div>
      <div className="urlFooter">{shortUrl}</div>
    </div>
  );
};

export default stickerLinkPersonal;
