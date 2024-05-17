// background.js
import { Actions } from "../conts/actions";

// Listen for messages from content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.action) {
    case "getActiveTabId":
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        sendResponse(activeTab.id);
      });
      return true;

    case Actions.MOVE_TAB_TO_START:
      // console.log("RECIEVED TABID", request.data.tabId);

      chrome.tabs.move(request.data.tabId, { index: 0 }, (movedTab) => {
        // console.log("DONEEE");
      });
      return true;
    case Actions.SAVE_TO_LOCAL_STORAGE:
      // console.log("SAVING TO LOCAL STORAGE", request.data);
      chrome.storage.local.set({ readefine: request.data }, function () {
        // console.log("State saved");
      });
      return true;
    case Actions.GET_FROM_LOCAL_STORAGE:
      return true;
    default:
      break;
  }

  if (request.action === "getActiveTab") {
    // Get information about the active tab
  }
});

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action === Actions.MOVE_TAB_TO_START) {
//     chrome.tabs.move(request.data.tabId, { index: 0 }, (movedTab) => {
//       console.log("DONEEE");
//     });
//   }
// });

// chrome.storage.local.set({ 'extensionState': state }, function() {
//   console.log('State saved');
// });
