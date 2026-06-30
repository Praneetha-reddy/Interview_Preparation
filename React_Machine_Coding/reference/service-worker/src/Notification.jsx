import { memo } from "react";

/**
 * Displays a single notification item with distinct styling for read and unread messages.
 *
 * This component is memoized to avoid unnecessary re-renders when the parent list updates.
 * It receives the notification payload and a callback that persists the read state when the
 * user interacts with the item.
 */
const Notification = memo(function Notification({
  notification,
  onNotificationClick,
}) {
  const { id, title, body, timestamp, isRead } = notification;

  return (
    <div
      style={{
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: isRead ? "#f9f9f9" : "#e6f7ff",
      }}
      onClick={() => onNotificationClick(id)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onNotificationClick(id);
        }
      }}
    >
      <strong>{title}</strong>
      <p style={{ margin: "4px 0" }}>{body}</p>
      <small style={{ color: "#666" }}>
        {new Date(timestamp).toLocaleTimeString()}
      </small>
    </div>
  );
});

export default Notification;
