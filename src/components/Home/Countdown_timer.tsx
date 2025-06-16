import { useState, useEffect } from "react";

import type { CountdownProps } from "./types";

export default function CountdownTimer({ startDate }: CountdownProps) {
  const [remainingTime, setRemainingTime] = useState<number>(
    startDate.getTime() - Date.now()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = startDate.getTime() - Date.now();
      setRemainingTime(diff);

      if (diff <= 0) {
        clearInterval(timer);
        setRemainingTime(0);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startDate]);

  const formatTime = (ms: number): string => {
    if (ms <= 0) {
      return "00:00:00";
    }

    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    const pad = (num: number): string => num.toString().padStart(2, "0");

    if (days > 0) {
      return `${pad(days)} Days | ${pad(hours)} Hours | ${pad(
        minutes
      )}  Minutes | ${pad(seconds)} seconds `;
    }
    return `${pad(hours)} Hours | ${pad(minutes)} Minutes | ${pad(
      seconds
    )} seconds `;
  };

  return <div className="countdown-timer">{formatTime(remainingTime)}</div>;
}
