# Live Chat Demo

This project is a small React demo that simulates a live chat feed using a mock real-time source.
It shows how a UI can handle frequent incoming updates without re-rendering too aggressively.

## What this project demonstrates

- React component composition with a root component and a chat container
- State management with `useState` and `useRef`
- A custom hook acting as a mock websocket-like event source
- Message buffering with a `flushMessages` interval for batching updates
- Performance optimization with `React.memo`
- Cleanup logic for intervals and effects
- Smooth scrolling to the newest message

## Project structure

- src/App.jsx: root application component
- src/ChatApp.jsx: main chat UI and live update logic
- src/MessageItem.jsx: memoized message row component
- src/hooks/useMessageEmitter.js: mock websocket-style message generator

## Core concepts used

### 1. Mock websocket behavior

The custom hook emits fake chat events at intervals to mimic a live connection.
This is useful for UI prototyping and interview-style demos.

### 2. Buffering and batching

Instead of updating React state for every incoming message, the app stores events in a buffer and flushes them in batches.
This reduces unnecessary re-renders and keeps the UI responsive.

### 3. Performance optimizations

- `useCallback` stabilizes the message handler
- `useRef` avoids extra renders for temporary data
- `React.memo` prevents unchanged message items from re-rendering

### 4. Cleanup

All timers created for the mock stream and batching logic are cleaned up in the effect return function.
This prevents memory leaks when the component unmounts.

## How to run

1. Install dependencies:
   `npm install`
2. Start the development server:
   `npm start`
3. Open http://localhost:3000

## Build

To create a production build, run:

`npm run build`
