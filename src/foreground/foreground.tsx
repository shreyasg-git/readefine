import React from "react";

import ReactDOM from "react-dom";
import { Actions } from "../conts/actions";
import { log } from "console";

type AppProps = { rootPageUrl: string };

const smartWidth = (iframe: HTMLIFrameElement) => {
  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  const body = iframeDoc?.body;
  const html = iframeDoc?.documentElement;

  // @ts-ignore
  const hasHoriScrollBar = body?.scrollWidth > html?.clientWidth;
  console.log(
    "BODY SCROLL : ",
    body?.scrollWidth,
    ", CLIENT WIDTH : ",
    html?.clientWidth
  );

  if (hasHoriScrollBar) {
    console.log("Horizontal scrollbar is visible", iframe);
  } else {
    console.log("Horizontal scrollbar is not visible", iframe);
  }
};

const appendIFrame = (link: string) => {
  const iframeArr = document.getElementById("iframe-array");
  const iframe = document.createElement("iframe");
  iframe.src = link;
  // iframe.style.width = "80%";
  iframe.style.width = "100%";
  iframe.style.minWidth = "500px";
  iframe.style.height = "98vh";
  iframe.style.zIndex = "1000";
  iframe.style.overflowX = "hidden";
  iframeArr?.appendChild(iframe);
  smartWidth(iframe);

  window.addEventListener(
    "wheel",
    (event: any) => {
      console.log("YOOOOOOOOOOOOOOOOOOOOOOOOOOO");

      if (event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        console.log("YOOOOOOOOOOOO");

        const iframeArr = document.getElementById("iframe-array");
        if (iframeArr) {
          iframeArr.scrollLeft += event.deltaY;
        }
      }
    },
    { passive: true }
  );

  iframe.addEventListener("load", () => {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (iframeDoc) {
      addListenersToLinks(iframeDoc);
    }
  });
};

const onAnyLinkClick = (event: MouseEvent) => {
  event.preventDefault();
  event.stopImmediatePropagation();

  // @ts-ignore
  // console.log("ReaDefine Override", event.target?.href);
  // @ts-ignore
  appendIFrame(event.target?.href);
};

const overrideLinkClicks = () => {
  let iframes = document.querySelectorAll("iframe");
  iframes.forEach((iframe) => {
    iframe.addEventListener("load", () => {
      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc) {
        addListenersToLinks(iframeDoc);
      }
    });
  });
};

const swapFavicon = () => {
  let link: HTMLLinkElement | null =
    document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }

  link.href = "%PUBLIC_URL%/favicon.ico";
  // console.log("LINK HREF", link.href);
};

function addListenersToLinks(doc: Document) {
  var allLinks = doc.querySelectorAll("a");
  allLinks.forEach(function (link) {
    link.addEventListener("click", onAnyLinkClick);
  });
}

const initializeReaDefine = (root_url: string) => {
  console.log("Initializing Readefine...");

  chrome.runtime.sendMessage({ action: "getActiveTabId" }, function (response) {
    // console.log("Response from background script:", response);
    const activeTabId = response;
    chrome.runtime.sendMessage({
      action: Actions.MOVE_TAB_TO_START,
      data: { tabId: activeTabId },
    });
    chrome.runtime.sendMessage({
      action: Actions.SAVE_TO_LOCAL_STORAGE,
      data: { root_tab_id: activeTabId },
    });
    document.title = "Readefine";
    // INITIALIZE READEFINE HERE ----------------------------------------------------------------

    swapFavicon();
    initializeRoot(root_url);
    overrideLinkClicks();
  });
};

function initializeRoot(src: string) {
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
    <div
      id="iframe-array"
      style={{ display: "flex", flexDirection: "row", overflow: "scroll" }}
    >
      <iframe
        src={rootPageUrl}
        title="root_page"
        style={{ width: "80%", height: "98vh", zIndex: 1000 }}
      />
    </div>
  );
};

// Listen for a message from the popup script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === Actions.RD_Init_Pop) {
    initializeReaDefine(message.src);
  }
});
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "pageLoaded") {
//     createIframe(message.src);
//   }
// });

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
