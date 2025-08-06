import { useTheme } from "../../../context/Theme_toggle";
import type { ViewModeTabsProps } from "../FilterTabTypes";

export default function ViewModeTabs({setViewMode, viewMode}:ViewModeTabsProps) {

    const {theme} = useTheme()
  return (
    <div
      className={`w-full flex  border-b ${
        theme === "light"
          ? "border-gray-200 bg-[#f5f7f9]"
          : "border-gray-700 bg-[#101828]"
      }`}
    >
      <button
        onClick={() => setViewMode("banners")}
        className={`px-4 py-3 mr-2 w-1/2 text-sm font-medium relative transition-colors duration-200 ${
          viewMode === "banners"
            ? theme === "light"
              ? "text-[#52649e]"
              : "text-[#6b85d6]"
            : theme === "light"
            ? "text-gray-500 hover:text-gray-700"
            : "text-gray-400 hover:text-gray-200"
        }`}
      >
        Banners
        {viewMode === "banners" && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#52649e]"></div>
        )}
      </button>

      <button
        onClick={() => setViewMode("cards")}
        className={`px-4 py-3 text-sm w-1/2 font-medium relative transition-colors duration-200 ${
          viewMode === "cards"
            ? theme === "light"
              ? "text-[#52649e]"
              : "text-[#6b85d6]"
            : theme === "light"
            ? "text-gray-500 hover:text-gray-700"
            : "text-gray-400 hover:text-gray-200"
        }`}
      >
        Cards
        {viewMode === "cards" && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#52649e]"></div>
        )}
      </button>
    </div>
  );
}
