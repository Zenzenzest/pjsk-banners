import { useState, useEffect } from "react";
import type { CountdownProps } from "./types";
import "./Countdown.css";

export default function CountdownTimer({
  targetDate,
  mode,
  compact,
  onComplete,
}: CountdownProps) {
  const [remainingTime, setRemainingTime] = useState<number>(
    targetDate.getTime() - Date.now()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = targetDate.getTime() - Date.now();
      setRemainingTime(diff);

      if (diff <= 0) {
        clearInterval(timer);
        setRemainingTime(0);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, mode, onComplete]);

  const formatTime = (ms: number) => {
    if (ms <= 0) {
      return (
        <span
          className={`font-medium ${
            compact ? "text-xs" : "text-sm md:text-base"
          }`}
        >
          {mode === "start" ? "Started" : "Ended"}
        </span>
      );
    }

    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    const TimeUnit = ({ value, label }: { value: number; label: string }) => (
      <div className="flex flex-col items-center mx-0.5 sm:mx-1">
        <div
          className={`
          font-bold bg-white/5 rounded-md flex items-center justify-center 
          ${
            compact
              ? "text-xs w-5 h-5 sm:text-sm sm:w-6 sm:h-6"
              : "text-sm w-6 h-6 sm:text-base sm:w-7 sm:h-7 md:w-8 md:h-8"
          }
        `}
        >
          {value.toString().padStart(2, "0")}
        </div>
        {!compact && (
          <span className="text-[9px] sm:text-[10px] opacity-80">{label}</span>
        )}
      </div>
    );

    return (
      <div className="flex items-center">
        {days > 0 && (
          <>
            <TimeUnit value={days} label="D" />
            <span className="mx-0.5 opacity-50">:</span>
          </>
        )}
        <TimeUnit value={hours} label="H" />
        <span className="mx-0.5 opacity-50">:</span>
        <TimeUnit value={minutes} label="M" />
        {(!compact || window.innerWidth > 640) && ( // Show seconds on larger mobile screens
          <>
            <span className="mx-0.5 opacity-50">:</span>
            <TimeUnit value={seconds} label="S" />
          </>
        )}
      </div>
    );
  };

  return (
    <div
      className={`
      inline-flex items-center rounded-lg px-2 py-1 sm:px-3 sm:py-1.5
      ${
        mode === "end"
          ? "bg-red-500/10 border border-red-500/20"
          : "bg-blue-500/10 border border-blue-500/20"
      }
      ${compact ? "text-xs sm:text-sm" : "text-sm sm:text-base"}
    `}
    >
      {mode === "end" && (
        <span
          className={`
          mr-1 sm:mr-2 rounded-full 
          ${
            compact
              ? "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500"
              : "live-pulse bg-red-500 text-white px-1.5 py-0.5 text-[10px] sm:text-xs"
          }
        `}
        >
          {!compact && "LIVE"}
        </span>
      )}

      <div className="flex items-center">
        {!compact && (
          <span className="mr-1 sm:mr-2 hidden xs:inline">
            {mode === "start" ? "Starts:" : "Ends:"}
          </span>
        )}
        {formatTime(remainingTime)}
      </div>
    </div>
  );
}
