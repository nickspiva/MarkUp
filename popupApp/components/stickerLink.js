import React, { useState } from "react";
import moment from "moment";

const stickerLink = (props) => {
  const { sticker } = props;
  const { message, url, createdAt } = sticker;
  let shortUrl = url;

  const [archived, toggleArchiveStatus] = useState(sticker.archived);

  //adds a default sticker to the webpage
  async function addSticker(sticker) {
    console.log("running addSticker function");
    //sets up the query to fetch the current url
    const query = { active: true, currentWindow: true };
    if (!sticker) sticker = {};

    //sets up the callback function to process result of the query,
    //aka build the sticker
    const returnUrl = async (tabs) => {
      const currentTab = tabs[0];
      //build a basic sticker with the url and user set
      const defaultSticker = {
        message: sticker.message || "default sticker",
        height: sticker.height || "200px",
        width: sticker.width || "200px",
        xPos: sticker.xPos || "200px",
        yPos: sticker.yPos || "200px",
        url: currentTab.url,
        user: sticker.user,
        id: sticker.id,
      };
      //set's it as not belonging to the user
      defaultSticker.mine = false;
      //sends message to the content script for processing the new sticker
      chrome.tabs.sendMessage(currentTab.id, {
        subject: "showSticker",
        sticker: [defaultSticker],
      });
    };

    chrome.tabs.query(query, returnUrl);
  }

  async function removeSticker(stickerId) {
    console.log("running removeSticker function");
    //sets up the query to fetch the current url
    const query = { active: true, currentWindow: true };

    //sets up the callback function to process result of the query,
    const returnUrl = async (tabs) => {
      const currentTab = tabs[0];

      //sends message to the content script for processing the new sticker
      chrome.tabs.sendMessage(currentTab.id, {
        subject: "removeSticker",
        id: stickerId,
      });
    };

    chrome.tabs.query(query, returnUrl);
  }

  const toggleArchived = () => {
    if (!archived) {
      chrome.runtime.sendMessage({
        msg: "archiveSticker",
        id: sticker.id,
      });
      removeSticker(sticker.id);
    } else {
      chrome.runtime.sendMessage({
        msg: "unarchiveSticker",
        id: sticker.id,
      });
      addSticker(sticker);
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
