import React from "react";

import ReactDOM from "react-dom";
import { Actions } from "../conts/actions";
import { log } from "console";

type AppProps = { rootPageUrl: string };

const initializeReaDefine = (root_url: string) => {
  createIframe(root_url);

  chrome.runtime.sendMessage({ action: "getActiveTabId" }, function (response) {
    console.log("Response from background script:", response);
    const activeTabId = response;
    chrome.runtime.sendMessage({
      action: Actions.MOVE_TAB_TO_START,
      data: { tabId: activeTabId },
    });
    chrome.runtime.sendMessage({
      action: Actions.SAVE_TO_LOCAL_STORAGE,
      data: { root_tab_id: activeTabId },
    });
  });
};

function createIframe(src: string) {
  const appContainer = document.createElement("div");
  appContainer.id = "react-root";
  appContainer.style.position = "relative";

  document.body.innerHTML = "";
  const bodyAttributes = document.body.getAttributeNames();
  bodyAttributes.forEach((attr) => {
    document.body.removeAttribute(attr);
  });
  document.body.appendChild(appContainer);
  ReactDOM.render(<App rootPageUrl={src} />, appContainer);
}

const App: React.FC<AppProps> = ({ rootPageUrl }) => {
  return (
    <>
      <iframe
        src={rootPageUrl}
        title="root_page"
        style={{ width: "80%", height: "1000px", zIndex: 1000 }}
      />
    </>
  );
};

// Listen for a message from the popup script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === Actions.RD_Init_Pop) {
    initializeReaDefine(message.src);
  }
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "pageLoaded") {
    createIframe(message.src);
  }
});

window.onload = async (passed) => {
  console.log("passed", passed);
  console.log(window.location.href);
  // initializeReaDefine(window.location.href);

  chrome.runtime.sendMessage({ action: "getActiveTabId" }, function (response) {
    console.log("Response from background script:", response);
    const activeTabId = response;

    chrome.storage.local.get("readefine", function (localState) {
      console.log("State GOT", localState.readefine.root_tab_id, activeTabId);
      if (localState.readefine.root_tab_id === activeTabId) {
        initializeReaDefine(window.location.href);
      }
    });
  });
};

window.onkeydown = (event) => {
  console.log(event.key);

  if (event.key === "Z" && event.ctrlKey && event.shiftKey) {
    initializeReaDefine(window.location.href);
  }
};
