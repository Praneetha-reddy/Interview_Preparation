import React, { useState, useEffect, useCallback } from "react";
import Notification from "./Notification";
import { getNotificationsFromDB, markNotificationAsRead } from "./utils/db";

/**
 * Root application component that renders the notification list and coordinates the
 * interaction between the browser UI, the service worker, and IndexedDB.
 *
 * Responsibilities:
 * - listens for notifications broadcast by the service worker
 * - loads previously saved notifications when the app starts
 * - updates the UI when a notification is marked as read
 *
 * Edge cases handled:
 * - browsers that do not support service workers
 * - first-time app loads where no notification data exists in IndexedDB yet
 * - clicks on notifications that may already be marked as read
 */
export default function App() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    /**
     * Receives messages from the service worker and inserts new notifications at the top
     * of the list so the UI updates instantly after a push event arrives.
     */
    const handleServiceWorkerMessage = (event) => {
      if (event.data?.type === "NEW_NOTIFICATION") {
        const newNotification = event.data.payload;
        setNotifications((prev) => [newNotification, ...prev]);
      }
    };

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener(
        "message",
        handleServiceWorkerMessage,
      );
    }

    return () => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener(
          "message",
          handleServiceWorkerMessage,
        );
      }
    };
  }, []);

  useEffect(() => {
    /**
     * Restores notifications from IndexedDB on first render so users can see
     * previously received notifications even after a refresh or reconnect.
     */
    const loadOfflineData = async function () {
      try {
        const response = await getNotificationsFromDB();
        setNotifications(response);
      } catch (err) {
        console.error("Failed to load notifications from IndexedDB.", err);
      }
    };

    loadOfflineData();
  }, []);

  const handleNotificationClick = useCallback(
    async function handleNotificationClick(id) {
      /**
       * Persists the read state for the clicked notification and updates the UI immediately.
       */
      try {
        await markNotificationAsRead(id);
        setNotifications((currentNotifications) =>
          currentNotifications.map((notification) =>
            notification.id === id
              ? { ...notification, isRead: true }
              : notification,
          ),
        );
      } catch (err) {
        console.error("Failed to mark notification as read.", err);
      }
    },
    [],
  );

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "20px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2>
        Notifications ({notifications.filter((notification) => !notification.isRead).length} unread)
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {notifications.map((notification) => (
          <Notification
            notification={notification}
            onNotificationClick={handleNotificationClick}
            key={notification.id}
          />
        ))}

        {notifications.length === 0 && <p>No new notifications.</p>}
      </div>
    </div>
  );
}
