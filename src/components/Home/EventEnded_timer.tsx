import { useState, useEffect } from "react";
import type { EventEndedProps } from "./types";

export default function EventEndedTimer({
  endDate,
  compact = false,
}: EventEndedProps) {
  const [diffInDays, setDiffInDays] = useState<number>(0);

  useEffect(() => {
    const calculateDays = () => {
      const now = new Date();
      const diffTime = Math.max(0, now.getTime() - endDate.getTime());
      setDiffInDays(Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    };

    calculateDays();
    const interval = setInterval(calculateDays, 60 * 60 * 1000); // Update hourly

    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <div
      className={`
      inline-flex items-center rounded-lg px-3 py-1.5
      bg-gray-500/10 border border-gray-500/20
      ${compact ? "text-xs sm:text-sm" : "text-sm sm:text-base"}
    `}
    >
      <div className="flex items-center">
        <span className={`mr-1 sm:mr-2 ${compact ? "hidden" : "block"}`}>
          Ended:
        </span>
        <div className="flex items-center">
          {diffInDays === 0 ? (
            <span className="font-medium">Today</span>
          ) : (
            <>
              <div
                className={`
                font-bold bg-white/5 rounded-md flex items-center justify-center
                ${
                  compact
                    ? "w-5 h-5 text-xs sm:w-6 sm:h-6 sm:text-sm"
                    : "w-6 h-6 text-sm sm:w-7 sm:h-7 sm:text-base"
                }
              `}
              >
                {diffInDays}
              </div>
              <span className="ml-1 text-center">
                {diffInDays === 1 ? "day ago" : "days ago"}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
