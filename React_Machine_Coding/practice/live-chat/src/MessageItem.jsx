import { memo } from "react";
const MessageItem = memo(function MessageItem({ message }) {
  const { text, timestamp } = message;
  return (
    <div className="message-item">
      <p>{text}</p>
      <p>{timestamp}</p>
    </div>
  );
});
export default MessageItem;
