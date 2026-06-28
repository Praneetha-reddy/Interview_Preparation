import React from "react";

// MessageItem is a presentational component that renders a single chat message.
// It is wrapped with React.memo so React can skip re-rendering it when the same props arrive again.
// This is a small but useful performance optimization for long chat histories.
const MessageItem = React.memo(function MessageItem({ message }) {
  return (
    <div
      style={{
        marginBottom: "8px",
        padding: "8px",
        background: "#f1f1f1",
        borderRadius: "4px",
      }}
    >
      <span style={{ fontSize: "0.8em", color: "#888" }}>
        {message.timestamp}
      </span>
      <p style={{ margin: "4px 0 0 0" }}>{message.text}</p>
    </div>
  );
});
export default MessageItem;
