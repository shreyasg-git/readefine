import React from "react";
import ReactDOM from "react-dom";
import { Actions } from "../conts/actions";
import "./index.css";
import { log } from "console";

const LINKS: string[] = [];
const LINKS2: string[] = [
  "https://en.wikipedia.org/wiki/Randeep_Hooda",
  "https://en.wikipedia.org/wiki/Jats",
  "https://en.wikipedia.org/wiki/Rajputana",
  "https://en.wikipedia.org/wiki/Medieval_India",
  "https://en.wikipedia.org/wiki/Post-classical_history",
  "https://en.wikipedia.org/wiki/Randeep_Hooda",
  "https://en.wikipedia.org/wiki/Jats",
  "https://en.wikipedia.org/wiki/Jats",
  "https://en.wikipedia.org/wiki/Jats",
];

type AppProps = { rootPageUrl: string };

const initializeFromArray = () => {
  console.log("Initializing Readefine FROM HARDCODED LINKS...");

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

    swapFavicon();
    initializeRoot(LINKS2[0]);
    overrideLinkClicks();

    for (let i = 1; i < LINKS2.length; i++) {
      appendIFrame(LINKS2[i]);
    }
  });
};

const smartWidth = (iframe: HTMLIFrameElement) => {
  // const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  // const body = iframeDoc?.body;
  // const html = iframeDoc?.documentElement;
  // @ts-ignore
  // const hasHoriScrollBar = body?.scrollWidth > html?.clientWidth;
  // console.log(
  //   "BODY SCROLL : ",
  //   body?.scrollWidth,
  //   ", CLIENT WIDTH : ",
  //   html?.clientWidth
  // );
  // if (hasHoriScrollBar) {
  //   console.log("Horizontal scrollbar is visible", iframe);
  // } else {
  //   console.log("Horizontal scrollbar is not visible", iframe);
  // }
};

const appendIFrame = (link: string) => {
  const iframeArr = document.getElementById("iframe-array");
  const iframe = document.createElement("iframe");

  const styleString =
    "::-webkit-scrollbar { width: 8px; height: 8px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { border-radius: 4px; left: -30; top: -30; background: #888; } ::-webkit-scrollbar-thumb:hover { background: #555; }";

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  const style = iframeDoc?.createElement("style");
  if (style) {
    style.textContent = styleString;
    iframeDoc?.head.appendChild(style);
  }

  iframe.src = link;
  iframe.setAttribute("tabIndex", "-1");
  iframe.style.pointerEvents = "none";
  // iframe.style.width = "80%";
  LINKS.push(link);
  console.log("YOOOOOOO LINKS !!!", LINKS);

  iframe.style.position = "sticky";
  iframe.style.left = "0";
  iframe.style.zIndex = "10";
  iframe.style.minWidth = "625px";
  // ====================================================
  iframe.style.borderWidth = "0px";
  iframe.style.boxShadow = "0px 0px 15px 3px rgba(0,0,0,0.1)";
  iframe.style.overflowX = "hidden";

  iframeArr?.appendChild(iframe);
  // smartWidth(iframe);

  window.addEventListener(
    "wheel",
    (event: any) => {
      // console.log("YOOOOOOOOOOOOOOOOOOOOOOOOOOO");

      if (event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        // console.log("YOOOOOOOOOOOO");

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
  // link.href = chrome.runtime.getURL("assets/loader.svg");
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
    window.addEventListener("keydown", (event) => {
      if (event.key === "Control") {
        const SIDEBAR = document.getElementById("readefine-sidebar");
        if (SIDEBAR) {
          SIDEBAR.style.display = "flex";
        } else {
          console.log("SIDEBAR NOT FOUND");
        }
      }
      console.log("CTRL KEY PRESSED");
    });
    window.addEventListener("keyup", (event) => {
      if (event.key === "Control") {
        const SIDEBAR = document.getElementById("readefine-sidebar");
        if (SIDEBAR) {
          SIDEBAR.style.display = "none";
        } else {
          console.log("SIDEBAR NOT FOUND");
        }
      }
      console.log("CTRL KEY PRESSED");
    });
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
  // NOTE: this must be done here only, since we are removing all attrs in the block above
  document.body.style.overflow = "hidden";
  document.body.setAttribute("tabIndex", "-1");
  console.log(document);

  document.body.appendChild(appContainer);
  ReactDOM.render(<App rootPageUrl={src} />, appContainer);
}

const App: React.FC<AppProps> = ({ rootPageUrl }) => {
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div
        id="readefine-sidebar"
        style={{
          width: "400px",
          borderWidth: "1",
          borderColor: "#fff",
          borderStyle: "solid",
          backgroundColor: "rgba(0,0,0,0.8)",
          display: "none",
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 99999,
        }}
      >
        <h3>TREEE</h3>
        <h3>TREEE</h3>
        <h3>TREEE</h3>
        <h3>TREEE</h3>
        <h3>TREEE</h3>
        <h3>TREEE</h3>
        <h3>TREEE</h3>
      </div>
      <div
        id="iframe-array"
        style={{
          display: "flex",
          flexDirection: "row",
          position: "relative",
          width: "95vw",
          // overflowY: "auto" /* Ensure scrolling */,
          // overflowX: "auto" /* Ensure scrolling */,
          overflow: "overlay",
          height: "99vh",

          // borderWidth: "2px",f
          // borderColor: "red",
          // borderStyle: "solid",
        }}
      >
        <iframe
          tabIndex={-1}
          src={rootPageUrl}
          title="root_page"
          style={{
            pointerEvents: "none",

            // position: "-webkit-sticky",
            position: "sticky",
            left: 0,
            zIndex: 10,
            minWidth: "625px",
          }}
        />
      </div>
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
  // console.log("passed", passed);
  // console.log(window.location.href);
  // initializeReaDefine(window.location.href);

  chrome.runtime.sendMessage({ action: "getActiveTabId" }, function (response) {
    // console.log("Response from background script:", response);
    const activeTabId = response;

    chrome.storage.local.get("readefine", function (localState) {
      // console.log("State GOT", localState.readefine.root_tab_id, activeTabId);
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
  } else if (event.key === "X" && event.ctrlKey && event.shiftKey) {
    initializeFromArray();
  }
};
