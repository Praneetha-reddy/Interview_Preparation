import { useState, useRef, useEffect } from "react";

import useMessageEmitter from "./hooks/useMessageEmitter";
import MessageItem from "./MessageItem";

import { FLUSH_MESSAGES_TIMER } from "./constants";

export default function App() {
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);
  const messagesBuffer = useRef([]);

  function handleMessageEmit(message) {
    //     setMessages((messages) => [...messages, message]);
    messagesBuffer.current.push(message);
  }
  useEffect(
    function () {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behaviour: "smooth" });
      }
    },
    [messages],
  );

  useEffect(function () {
    const flushMessages = setInterval(function () {
      const currentBatch = [...messagesBuffer.current];
      setMessages((messages) => [...messages, ...currentBatch]);
      messagesBuffer.current = [];
    }, FLUSH_MESSAGES_TIMER);
    return function () {
      clearInterval(flushMessages);
    };
  });

  useMessageEmitter(handleMessageEmit);
  return (
    <div className="container">
      {messages.map((message) => (
        <MessageItem message={message} key={message.id} />
      ))}
      <div ref={bottomRef}></div>
    </div>
  );
}
