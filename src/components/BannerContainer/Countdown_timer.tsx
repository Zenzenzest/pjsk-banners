import { useState, useEffect } from "react";
import type { CountdownProps } from "../Types";
import "./Countdown.css";
import { useTheme } from "../../context/Theme_toggle";

export default function CountdownTimer({
  targetDate,
  mode,
  compact,
  onComplete,
}: CountdownProps) {
  if (targetDate.getTime() === 1752735600000) {
    console.log(targetDate.getTime());
  }
  const [remainingTime, setRemainingTime] = useState<number>(
    targetDate.getTime() - Date.now()
  );
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const { theme } = useTheme();

  // Check if device is mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 540);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
        <span className={`font-medium ${compact ? "text-xs" : "text-sm"}`}>
          {mode === "start" ? "Started" : "Ended"}
        </span>
      );
    }

    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    const TimeUnit = ({ value, label }: { value: number; label: string }) => (
      <div className="flex flex-col items-center min-w-0">
        <div
          className={`
            font-bold bg-white/5 rounded-md flex items-center justify-center
            ${
              compact || isMobile
                ? "text-xs w-5 h-5 min-w-[1.25rem]"
                : "text-sm w-6 h-6 min-w-[1.5rem] sm:text-base sm:w-7 sm:h-7"
            }
          `}
        >
          {value.toString().padStart(2, "0")}
        </div>
        {!compact && (
          <span className="text-[9px] sm:text-[10px] opacity-80 mt-0.5">
            {label}
          </span>
        )}
      </div>
    );

    // Mobile-specific layout
    if (isMobile || compact) {
      return (
        <div className="flex items-center gap-1">
          {days > 0 && (
            <>
              <TimeUnit value={days} label="D" />
              <span className="opacity-50 text-xs">:</span>
            </>
          )}
          <TimeUnit value={hours} label="H" />
          <span className="opacity-50 text-xs">:</span>
          <TimeUnit value={minutes} label="M" />
          {/* Only show seconds on mobile if there's enough space or if compact is false */}
          {(!compact || window.innerWidth > 480) && (
            <>
              <span className="opacity-50 text-xs">:</span>
              <TimeUnit value={seconds} label="S" />
            </>
          )}
        </div>
      );
    }

    // Desktop layout
    return (
      <div className="flex items-center gap-1">
        {days > 0 && (
          <>
            <TimeUnit value={days} label="D" />
            <span className="opacity-50">:</span>
          </>
        )}
        <TimeUnit value={hours} label="H" />
        <span className="opacity-50">:</span>
        <TimeUnit value={minutes} label="M" />
        <span className="opacity-50">:</span>
        <TimeUnit value={seconds} label="S" />
      </div>
    );
  };

  return (
    <div
      className={`
        inline-flex items-center rounded-lg transition-all duration-200
        ${isMobile || compact ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"}
        ${
          mode === "end"
            ? "bg-red-500/10 border border-red-500/20"
            : "bg-blue-500/10 border border-blue-500/20"
        }
      `}
    >
      {mode === "end" && (
        <span
          className={`
            mr-1 sm:mr-2 rounded-full flex-shrink-0
            ${
              compact || isMobile
                ? "w-1.5 h-1.5 bg-red-500"
                : "live-pulse bg-red-500 px-1.5 py-0.5 text-[10px] sm:text-xs"
            }
          `}
        >
          {!compact && !isMobile && "LIVE"}
        </span>
      )}
      <div
        className={`flex items-center min-w-0 ${
          theme === "light" ? "text-gray-800" : "text-gray-100"
        }`}
      >
        {!compact && !isMobile && (
          <span className="mr-2 whitespace-nowrap">
            {mode === "start" ? "Start:" : ""}
          </span>
        )}
        {formatTime(remainingTime)}
      </div>
    </div>
  );
}
