import React from "react";

import ReactDOM from "react-dom";
import { Resizable } from "react-resizable";

// Define a container element in which to render the React app

// Render the React app into the container

type AppProps = { rootPageUrl: string };

const App: React.FC<AppProps> = ({ rootPageUrl }) => {
  return (
    <>
      <iframe
        src={rootPageUrl}
        title="root_page"
        style={{ width: "80%", zIndex: 1000 }}
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
