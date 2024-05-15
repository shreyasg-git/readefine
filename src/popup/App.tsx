import React from "react";
import "./App.css";
import { useState } from "react";
import { Actions } from "../conts/actions";
const Popup = () => {
  const transferPage = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];

      chrome.scripting.executeScript(
        {
          target: { tabId: activeTab.id as number },
          func: () => document.documentElement.outerHTML,
        },
        (result) => {
          // const pageContent = result[0].result;
          const currentPageURL = activeTab.url;

          chrome.tabs.sendMessage(activeTab.id as number, {
            action: Actions.RD_Init_Pop,
            url: currentPageURL,
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
      {/* <div className="App">Hello World</div> */}
      <Popup />
    </div>
  );
}

export default App;
