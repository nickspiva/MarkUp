import React, { useState } from "react";
import moment from "moment";

const stickerLinkPersonal = (props) => {
  const { sticker } = props;
  const { message, url, updatedAt } = sticker;
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
        user: props.user,
        id: sticker.id,
      };
      //set's it as belonging to the user
      defaultSticker.mine = true;
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
      console.log("adding sticker to content");
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

  const displayDate = moment(updatedAt).fromNow();

  return (
    <div className="stickerContainer">
      <div className="stickerHeader">
        <div className="userName">
          <div class="timePassed">
            {" "}
            <span>{displayDate}</span>
          </div>
          <div class="blankSpace"></div>
          <div class="archived" onClick={toggleArchived}>
            <span> {archived ? " (hidden)" : " (visible)"}</span>
          </div>
        </div>
        {/* <div className="spacer"></div> */}
      </div>
      <div className="stickerLink" onClick={() => openNewTab(url)}>
        <div>{message} </div>
      </div>
      <div className="urlFooter">{shortUrl}</div>
    </div>
  );
};

export default stickerLinkPersonal;
