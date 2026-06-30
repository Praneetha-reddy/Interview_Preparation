import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

/**
 * Registers the service worker after the page has finished loading so the application can
 * receive push events without blocking the initial render.
 *
 * If service workers are unsupported, the app still renders normally and shows the UI without
 * background push support.
 */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log(
          "Service Worker registered successfully with scope:",
          registration.scope,
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
} else {
  console.warn("Service Workers are not supported in this browser.");
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
