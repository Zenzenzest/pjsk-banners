import { useTheme } from "../../context/Theme_toggle";

export default function Disclaimer() {
  const { theme } = useTheme();
  const disclaimerMessage = "Schedules from October 12 2025 onward will be adjusted when officially announced."
  return (
    <div
      className={`mb-4 p-2 rounded-xl border-l-4 ${
        theme === "dark"
          ? "bg-gray-800/50 border-blue-400 text-gray-300"
          : "bg-blue-50 border-blue-400 text-gray-700"
      }`}
    >
      <div className="flex items-start space-x-3">
        <div
          className={`mt-1 ${
            theme === "dark" ? "text-blue-400" : "text-blue-500"
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div>
          <p className="font-medium mb-2">Global Server Schedule Note</p>
          <p className="text-sm opacity-90 mb-3">
            Global server typically follows JP server with:
          </p>
          <div className="space-y-1 text-sm">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-current rounded-full opacity-60"></span>
              <span>
                <strong>Event banners:</strong> Exactly 1 year gap
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-current rounded-full opacity-60"></span>
              <span>
                <strong>Rerun banners:</strong> Approximately 350-380 days gap (1
                year & ±15 days)
              </span>
            </div>
          </div>
          <p className="text-sm mt-3 opacity-80">
           {disclaimerMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
