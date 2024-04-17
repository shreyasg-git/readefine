// // Add an event listener for when a navigation completes in a tab
// chrome.webNavigation.onCompleted.addListener(
//   (details) => {
//     // `details` contains information about the completed navigation

//     // Get the tab where the navigation completed
//     chrome.tabs.get(details.tabId, (tab) => {
//       if (tab) {
//         // Retrieve the URL of the tab
//         const currentPageURL = tab.url;

//         // Log the current page's URL
//         console.log("Current page URL:", currentPageURL);

//         // If you want to send the URL to the content script or perform other actions, you can do so here
//         // For example, sending the URL to the content script
//         chrome.tabs
//           .sendMessage(tab.id as number, {
//             action: "pageLoaded",
//             url: currentPageURL,
//           })
//           .then(() => {
//             console.log("Message sent to content script successfully");
//           })
//           .catch((error) => {
//             console.error("Error sending message to content script:", error);
//           });
//       } else {
//         console.error("No tab found with the provided tab ID.");
//       }
//     });
//   },
//   {
//     // Optional filter object for the event listener
//     // You can specify conditions such as the URL pattern to listen for
//     url: [{ urlMatches: "<all_urls>" }],
//   }
// );
