import { log } from "console";
import React from "react";

import ReactDOM from "react-dom";
import { Resizable } from "react-resizable";

// Define a container element in which to render the React app

// Render the React app into the container

type AppProps = { rootPageUrl: string };

const App: React.FC<AppProps> = ({ rootPageUrl }) => {
  return (
    <>
      {/* hllooooooooo */}
      <iframe
        src={rootPageUrl}
        title="root_page"
        style={{ width: "80%", height: "1000px", zIndex: 1000 }}
      />
    </>
  );
};

// Function to create and insert an iframe into the current page
// @ts-ignore
function createIframe(src) {
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

// Listen for a message from the popup script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "createIframe") {
    createIframe(message.src2);
  }
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "pageLoaded") {
    createIframe(message.src);
  }
});

//
console.log("HIIIIIIIIIIIIIIIIIIIIii");

const res = document.addEventListener("DOMContentLoaded", function () {
  console.log("AAAAAAAAAAAAAAAAAAAa");

  createIframe("https://en.wikipedia.org/wiki/Vinayak_Damodar_Savarkar");
});

window.onload = (passed) => {
  chrome.runtime.sendMessage({ action: "getActiveTab" }, function (response) {
    console.log("Response from background script:", response);
  });

  // const tab = chrome.tabs.query(
  //   { active: true, currentWindow: true },
  //   (tabs) => {
  //     const activeTab = tabs[0];
  //     console.log("active tab", activeTab);
  //   }
  // );
  console.log("passed", passed);
  // console.log("TAB", tab);
  // createIframe("https://en.wikipedia.org/wiki/Vinayak_Damodar_Savarkar");
};

console.log("LOLL", res);
