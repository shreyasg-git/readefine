import React from "react";
import "./App.css";
import { useState } from "react";

// Add an event listener for when a navigation completes in a tab
chrome.webNavigation.onCompleted.addListener(
  (details) => {
    // `details` contains information about the completed navigation

    // Get the tab where the navigation completed
    chrome.tabs.get(details.tabId, (tab) => {
      if (tab) {
        // Retrieve the URL of the tab
        const currentPageURL = tab.url;

        // Log the current page's URL
        console.log("Current page URL:", currentPageURL);

        // If you want to send the URL to the content script or perform other actions, you can do so here
        // For example, sending the URL to the content script
        chrome.tabs
          .sendMessage(tab.id as number, {
            action: "pageLoaded",
            src: currentPageURL,
          })
          .then(() => {
            console.log("Message sent to content script successfully");
          })
          .catch((error) => {
            console.error("Error sending message to content script:", error);
          });
      } else {
        console.error("No tab found with the provided tab ID.");
      }
    });
  },
  {
    // Optional filter object for the event listener
    // You can specify conditions such as the URL pattern to listen for
    url: [{ urlMatches: "<all_urls>" }],
  }
);

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
