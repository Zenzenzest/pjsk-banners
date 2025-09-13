import { useTheme } from "../context/Theme_toggle";

export default function LoadingComponent() {
  const { theme } = useTheme();
  return (
    <div
      className={`flex flex-col gap-5 items-center justify-center space-x-1 min-h-[90vh] ${
        theme === "dark" ? "bg-[#0e1721]" : "bg-gray-100"
      } `}
    >
      <img src={"mizuki_loading.png"} />
      <div className="flex gap-5 items-center justify-center space-x-1">
        <div className="w-2 h-2 bg-[#efb2ae] rounded-full animate-[fadeIn_1.5s_infinite]"></div>
        <div className="w-2 h-2 bg-[#efb2ae] rounded-full animate-[fadeIn_1.5s_infinite_0.2s]"></div>
        <div className="w-2 h-2 bg-[#efb2ae] rounded-full animate-[fadeIn_1.5s_infinite_0.4s]"></div>
        <div className="w-2 h-2 bg-[#efb2ae] rounded-full animate-[fadeIn_1.5s_infinite_0.6s]"></div>
        <div className="w-2 h-2 bg-[#efb2ae] rounded-full animate-[fadeIn_1.5s_infinite_0.8s]"></div>

        <style>
          {`
          @keyframes fadeIn {
            0%, 100% { opacity: 0; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
            75% { opacity: 0.7; transform: scale(1); }
          }
        `}
        </style>
      </div>
    </div>
  );
}
