import { bannerFilterCategories } from "../Categories";
import type { BannerFilterComponentTypes } from "../FilterTabTypes";

export default function BannerFilters({
  isOpen,
  tempBannerFilters,
  handleBannerFilters,
  handleReset,
  handleApply,
  handleCharacterFilterModeToggle,
}:BannerFilterComponentTypes) {
  return (
    <div
      className={`transition-all duration-500 ease-in-out overflow-hidden max-w-[500px] ${
        isOpen ? "max-h-[800px]  opacity-100" : "max-h-0 opacity-0"
      } bg-gray-600 rounded-lg p-1.5`}
    >
      {/* BANNER TYPE FILTER */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-white">Banner Type</h3>
        <div className="flex flex-wrap gap-2">
          {bannerFilterCategories["Banner Type"].map((type) => (
            <button
              key={type}
              onClick={() => handleBannerFilters("Banner Type", type)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                tempBannerFilters["Banner Type"].includes(type)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* CHARACTERS FILTER */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-white">Characters</h3>

          {/* CHARACTER FILTER MODE TOGGLE */}
          {tempBannerFilters.Characters.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">
                {tempBannerFilters.characterFilterMode === "all"
                  ? "All selected"
                  : "Any selected"}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={tempBannerFilters.characterFilterMode === "any"}
                  onChange={handleCharacterFilterModeToggle}
                />
                <div
                  className={`w-11 h-6 rounded-full transition-colors ${
                    tempBannerFilters.characterFilterMode === "any"
                      ? "bg-blue-500"
                      : "bg-gray-400"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 transform ${
                      tempBannerFilters.characterFilterMode === "any"
                        ? "translate-x-5"
                        : "translate-x-0.5"
                    } mt-0.5`}
                  ></div>
                </div>
              </label>
            </div>
          )}
        </div>

        {/* SHOW EXPLANATION */}
        {tempBannerFilters.Characters.length > 1 && (
          <div className="mb-3 p-2 bg-gray-700 rounded text-xs text-gray-300">
            {tempBannerFilters.characterFilterMode === "all"
              ? "Show banners that contain ALL selected characters"
              : "Show banners that contain ANY of the selected characters"}
          </div>
        )}

        <div className="flex justify-center items-center flex-wrap gap-3">
          {bannerFilterCategories.Characters.map((character, i) => {
            const characterIcon = `/images/character_icons/${i + 1}.webp`;
            const isSelected = tempBannerFilters.Characters.includes(character);

            return (
              <button
                key={character}
                className={`border-2 aspect-square rounded-full ${
                  isSelected ? "border-white" : "border-gray-600"
                }`}
                onClick={() => handleBannerFilters("Characters", character)}
              >
                <img
                  src={characterIcon}
                  style={{ width: "2.25rem" }}
                  alt={character}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={handleReset}
          className="bg-gray-300 text-black px-4 py-2 rounded"
        >
          Reset Filters
        </button>
        <button
          onClick={handleApply}
          className="bg-highlight-dark-mode text-white px-4 py-2 rounded"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
