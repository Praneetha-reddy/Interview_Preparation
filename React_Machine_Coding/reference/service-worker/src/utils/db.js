const DB_NAME = "Notifications";
const STORE_NAME = "notifications";

/**
 * Reads every stored notification from IndexedDB and returns them as an array.
 *
 * This helper is used when the app boots so the UI can restore the last known notification state.
 * If the store has not been created yet, it safely returns an empty array instead of throwing.
 */
export function getNotificationsFromDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.close();
        resolve([]);
        return;
      }

      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result);
      };

      getAllRequest.onerror = () => {
        reject(getAllRequest.error);
      };
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

/**
 * Updates a specific notification in IndexedDB so it is marked as read.
 *
 * The helper first locates the notification by its identifier, then writes the updated object
 * back into the store. If the notification cannot be found, it rejects with a descriptive error.
 */
export function markNotificationAsRead(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const notification = getRequest.result;
        if (!notification) {
          reject(new Error("Notification not found"));
          return;
        }

        notification.isRead = true;
        const putRequest = store.put(notification);

        putRequest.onsuccess = () => {
          resolve(notification);
        };

        putRequest.onerror = () => {
          reject(putRequest.error);
        };
      };

      getRequest.onerror = () => {
        reject(getRequest.error);
      };
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}
