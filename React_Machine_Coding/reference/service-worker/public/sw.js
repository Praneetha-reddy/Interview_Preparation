/**
 * Persists a notification object in IndexedDB so it survives a page refresh or browser restart.
 *
 * The service worker creates the notification store once, then inserts the incoming payload
 * using the notification ID as the primary key. If the database is opened for the first time,
 * the object store is created before the insert happens.
 */
function saveNotificationToDB(notification) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("Notifications", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("notifications")) {
        db.createObjectStore("notifications", { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction("notifications", "readwrite");
      const store = transaction.objectStore("notifications");
      const addRequest = store.add(notification);

      addRequest.onsuccess = () => resolve();
      addRequest.onerror = (err) => reject(err);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

/**
 * Handles incoming push notifications and turns them into app-level notification objects.
 *
 * The push event payload is parsed defensively so the app still works even when the server
 * sends malformed or plain-text data. Each notification receives a unique ID, timestamp, and
 * unread state before it is stored and broadcast to open clients.
 */
self.addEventListener("push", (event) => {
  const rawData = event.data ? event.data.text() : '{"title": "Empty"}';

  let parsedData;
  try {
    parsedData = JSON.parse(rawData);
  } catch (error) {
    parsedData = { title: rawData };
  }

  const notificationPayload = {
    id: Date.now().toString(),
    title: parsedData.title || "New Notification",
    body: parsedData.body || "",
    timestamp: new Date().toISOString(),
    isRead: false,
  };

  const saveAndBroadcast = async () => {
    try {
      await saveNotificationToDB(notificationPayload);
      const clientList = await self.clients.matchAll();

      clientList.forEach((client) => {
        client.postMessage({
          type: "NEW_NOTIFICATION",
          payload: notificationPayload,
        });
      });
    } catch (err) {
      console.error("Failed to save notification to IndexedDB.", err);
    }
  };

  event.waitUntil(saveAndBroadcast());
});
