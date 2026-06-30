# Service Worker Notification Demo

This project is a small React application that demonstrates how a service worker can receive push notifications, persist them in IndexedDB, and deliver them to the UI without requiring a full page refresh.

## What the app does

- Registers a service worker on startup.
- Listens for incoming push events in the service worker.
- Saves each notification to IndexedDB.
- Broadcasts the notification back to the React app so it appears instantly.
- Loads previously stored notifications when the page reloads.
- Lets the user mark a notification as read, which updates the stored record.

## Project workflow

1. The app bootstraps in the browser and registers the service worker from src/index.js.
2. When a push event is received, the service worker parses the payload and creates a normalized notification object in public/sw.js.
3. The service worker saves that object into IndexedDB and posts a message to the active React client.
4. The React app listens for the message in src/App.jsx, adds the new notification to the visible list, and updates the unread count.
5. On refresh, the app reads the stored notifications from IndexedDB using src/utils/db.js and restores them in the UI.
6. Clicking a notification marks it as read and writes the updated state back to IndexedDB.

## IndexedDB operations

The project uses a single database named Notifications with an object store named notifications.

- getNotificationsFromDB(): reads all stored notifications.
- markNotificationAsRead(id): finds a notification by its id and updates its isRead flag.

The store uses the notification id as the primary key, which keeps each item unique and makes updates straightforward.

## Basic functionality implemented

- Receive push-style notifications.
- Show notifications in a simple list.
- Distinguish unread and read items visually.
- Persist notifications between page reloads.
- Update the read state in both the UI and storage.

## Run locally

```bash
npm install
npm start
```

Then open http://localhost:3000 in your browser.

## Build for production

```bash
npm run build
```
