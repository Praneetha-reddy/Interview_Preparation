import { useEffect } from "react";

// This custom hook simulates an incoming real-time data source.
// In a production app it could be replaced with a WebSocket or Server-Sent Events connection.
// The intent is to act as a mock websocket so the UI can be tested without a backend.
function useMessageEmitter(onMessageReceived) {
  useEffect(
    function () {
      // A timer emits new messages every 200ms to mimic live traffic.
      const timer = setInterval(function () {
        const newMessage = {
          id: crypto.randomUUID(),
          text: `Live update: ${Math.random().toString(36).substring(7)}`,
          timestamp: new Date().toLocaleTimeString(),
        };
        onMessageReceived(newMessage);
      }, 200);

      // Cleanup ensures the interval is removed when the component using the hook unmounts.
      return function () {
        clearInterval(timer);
      };
    },
    [onMessageReceived],
  );
}

export { useMessageEmitter };
