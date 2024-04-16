import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";

const Popup = () => {
  const transferPage = () => {
    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];

      // Execute script in the current tab to get the page HTML content
      chrome.scripting.executeScript(
        {
          target: { tabId: activeTab.id as number },
          func: () => document.documentElement.outerHTML,
        },
        (result) => {
          const pageContent = result[0].result;
          const currentPageURL = activeTab.url;

          // Send a message to the content script to create the iframe
          console.log("SHAKATAPAKATA ", activeTab.id);

          chrome.tabs.sendMessage(activeTab.id as number, {
            action: "createIframe",
            src: `data:text/html;charset=utf-8,${encodeURIComponent(
              pageContent as string
            )}`,
            src2: currentPageURL,
          });
        }
      );
    });
  };

  return (
    <div>
      <button onClick={transferPage}>Transfer Page</button>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <div className="App">Hello World</div>
      <Popup />
    </div>
  );
}

export default App;
