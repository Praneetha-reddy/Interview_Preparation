import { useEffect } from "react";

import { EMIT_MESSAGE_TIMER } from "../constants";

function formatDate(date) {
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${hour.toString().padStart(2, 0)}:${minutes.toString().padStart(2, 0)}:${seconds.toString().padStart(2, 0)}`;
}

export default function useMessageEmitter(onMessageEmit) {
  useEffect(
    function () {
      const timer = setInterval(function () {
        const message = {
          id: crypto.randomUUID(),
          text: Math.random().toString(36).substring(7),
          timestamp: formatDate(new Date()),
        };
        onMessageEmit(message);
      }, EMIT_MESSAGE_TIMER);
      return function () {
        clearInterval(timer);
      };
    },
    [onMessageEmit],
  );
}
