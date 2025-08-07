import { useTheme } from "../../../context/Theme_toggle";
import type { SearchInputProps } from "../FilterTabTypes";

export default function SearchInput({
  viewMode,
  selectedBannerFilters,
  selectedCardFilters,
  handleSearchChange,
}:SearchInputProps) {
  const { theme } = useTheme();

  return (
    <div
      className={`w-full px-4 py-3 ${
        theme === "light" ? "bg-[#f5f7f9]" : "bg-[#101828]"
      }`}
    >
      <div className="relative w-[300px] sm:w-[500px] mx-auto">
        <input
          type="text"
          placeholder={`${
            viewMode === "banners" ? "Banner name, Mafu4, wl1..." : "Card name"
          }`}
          value={
            viewMode === "banners"
              ? selectedBannerFilters.search
              : selectedCardFilters.search
          }
          onChange={(e) => handleSearchChange(e.target.value)}
          className={`w-full px-3 py-2 pr-10 rounded-md border focus:outline-none focus:ring-2 focus:ring-[#52649e] ${
            theme === "light"
              ? "bg-white text-gray-900 border-gray-300"
              : "bg-gray-700 text-white border-gray-600"
          }`}
        />
        {((selectedBannerFilters.search && viewMode === "banners") ||
          (selectedCardFilters.search && viewMode === "cards")) && (
          <button
            onClick={() => handleSearchChange("")}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-opacity-20 transition-colors ${
              theme === "light"
                ? "text-gray-500 hover:bg-gray-500"
                : "text-gray-400 hover:bg-gray-400"
            }`}
            aria-label="Clear search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
