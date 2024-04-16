// Function to create and insert an iframe into the current page
// @ts-ignore
function createIframe(src) {
  const iframe = document.createElement("iframe");
  iframe.src = src;
  iframe.style.position = "fixed";
  iframe.style.top = "1%";
  iframe.style.left = "1%";
  iframe.style.width = "80%";
  iframe.style.height = "80%";
  iframe.style.border = "2px solid #454545";
  iframe.style.zIndex = "1000";
  document.body.innerHTML = "";
  document.body.appendChild(iframe);
}

// Listen for a message from the popup script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "createIframe") {
    createIframe(message.src2);
  }
});
