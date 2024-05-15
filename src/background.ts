// background.js

// Listen for messages from content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getActiveTab") {
    // Get information about the active tab
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa");
    let activeTab: any;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      activeTab = tabs[0];
      sendResponse(activeTab);
      console.log("TOOOOOOOOOO TAB ID", activeTab.id);
      window.alert(
        `this tab is at position ${
          activeTab!.index
        }, Readefine will move it to position 1 (after pinned tabs)`
      );
      chrome.tabs.move(activeTab!.id, { index: 0 }, (movedTab) => {
        console.log("DONEEE");
      });
    });

    // Return true to indicate that the response will be sent asynchronously

    return true;
  }
});
