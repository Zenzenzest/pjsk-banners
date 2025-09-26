import { useServer } from "../../../context/Server";
import { useTheme } from "../../../context/Theme_toggle";
import EventEndedTimer from "../Timers/EventEnded_timer";
import CountdownTimer from "../Timers/Countdown_timer";
import type { WithoutEventProps } from "../BannerTypes";
import { GetCurrentPath } from "../../../constants/common";
export default function WithoutEvent({
  banner,

  handleSaveBanner,
  isBannerSaved,
}: WithoutEventProps) {
  const { theme } = useTheme();
  const { server } = useServer();
  const today = Date.now();
  const startDate = new Date(Number(banner.start));
  const endDate = new Date(Number(banner.end));
  const location = GetCurrentPath();
  const formattedStart = startDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const formattedEnd = endDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="space-y-4">
      {" "}
      {banner.type !== "confirmed" && banner.type !== "rerun_estimation" && (
        // DATE RANGE
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <div
            className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm ${
              theme === "dark"
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Start: {formattedStart}</span>
          </div>
          <div
            className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm ${
              theme === "dark"
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>End: {formattedEnd}</span>
          </div>
        </div>
      )}
      <div>
        {/* COUNTDOWN TIMER */}
        {today < Number(banner.start) &&
          banner.type !== "confirmed" &&
          banner.type !== "rerun_estimation" && (
            <div className="flex justify-center ">
              <CountdownTimer targetDate={startDate} mode="start" />
            </div>
          )}
        {/* RERUN ESTIMATION */}
        {banner.type === "rerun_estimation" && banner.rerun && (
          <div className="flex justify-center">
            <div
              className={`px-4 py-2 rounded-xl font-medium ${
                theme === "dark"
                  ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                  : "bg-blue-50 text-blue-700 border border-blue-200"
              }`}
            >
              In {Math.floor((banner.rerun[0] - today) / 86400000)} -{" "}
              {Math.floor((banner.rerun[1] - today) / 86400000)} Days
            </div>
          </div>
        )}{" "}
        {/* ACTIVE/ENDED STATUS */}
        {today > Number(banner.end) && (
          <div className="flex justify-center">
            <EventEndedTimer endDate={endDate} />
          </div>
        )}
        {today > Number(banner.start) && today < Number(banner.end) && (
          <div className="flex justify-center">
            {endDate.getTime() < 2000000000000 && (
              <CountdownTimer targetDate={endDate} mode="end" />
            )}
          </div>
        )}
      </div>
      {/* SAVE BUTTON */}
      {(server === "global" || location === "/saved") &&
        (today < banner.start || isBannerSaved(banner.id)) && (
          <button
            onClick={() => handleSaveBanner(banner.id)}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isBannerSaved(banner.id)
                ? theme === "dark"
                  ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                  : "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                : theme === "dark"
                ? "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20"
                : "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
            }`}
          >
            {isBannerSaved(banner.id) ? (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span>Remove from Saved</span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                <span>Save Banner</span>
              </>
            )}
          </button>
        )}
    </div>
  );
}
