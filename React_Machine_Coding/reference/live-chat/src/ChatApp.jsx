import { useCallback, useState, useRef, useEffect } from "react";
import { useMessageEmitter } from "./hooks/useMessageEmitter";
import MessageItem from "./MessageItem";

// ChatApp is the main demo component.
// It simulates a real-time chat experience by buffering incoming events,
// flushing them in batches, and rendering them efficiently.
export default function ChatApp() {
  // messages holds the visible chat history shown in the UI.
  const [messages, setMessages] = useState([]);

  // messagesBuffer is a ref because we want to store temporary incoming data
  // without triggering a re-render on every single message event.
  const messagesBuffer = useRef([]);

  // bottomRef points to a spacer element used to keep the latest message visible.
  const bottomRef = useRef(null);

  // handleMessage is memoized so the custom hook does not recreate its dependency
  // on every render. This keeps the emitter effect stable and avoids unnecessary cleanup/re-run logic.
  const handleMessage = useCallback(function handleMessage(message) {
    // Instead of updating state immediately for each event, we push into a buffer.
    // This mimics a lightweight event-driven pipeline and reduces re-render churn.
    messagesBuffer.current.push(message);
  }, []);

  // The interval-based flushMessages pattern is intentional here.
  // It batches multiple incoming messages and updates the UI in a single state change,
  // which is a common performance optimization for high-frequency updates.
  useEffect(function () {
    const flushMessages = setInterval(() => {
      if (messagesBuffer.current.length > 0) {
        const currentBuffer = [...messagesBuffer.current];
        setMessages((messages) => [...messages, ...currentBuffer]);
        messagesBuffer.current = [];
      }
    }, 1000);

    // Cleanup is important to prevent memory leaks and stray timers when the component unmounts.
    return function () {
      clearInterval(flushMessages);
    };
  }, []);

  // useMessageEmitter acts like a mock websocket connection.
  // In a real app this would be replaced with a WebSocket or SSE subscription.
  useMessageEmitter(handleMessage);

  // Scroll to the latest message whenever the visible list changes.
  // This helps the UI feel like a live feed without requiring manual scrolling.
  useEffect(
    function () {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
    },
    [messages],
  );

  return (
    <div
      style={{
        width: "400px",
        height: "500px",
        border: "1px solid #ccc",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
        {messages.map((msg) => (
          // MessageItem is wrapped in React.memo to avoid re-rendering unchanged messages.
          <MessageItem key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef}></div>
      </div>
    </div>
  );
}
