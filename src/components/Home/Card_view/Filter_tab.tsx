import { useState, useEffect, useRef } from "react";
import type { SelectedFilterTypes } from "../../Global/Types";
import { useTheme } from "../../../context/Theme_toggle";
import FilteredBanners from "./Filtered_banners";
import FilteredCards from "./Filtered_cards";

const grouped: Record<string, string[]> = {
  "Virtual Singers": [
    "Hatsune Miku",
    "Kagamine Rin",
    "Kagamine Len",
    "Megurine Luka",
    "MEIKO",
    "KAITO",
  ],
  "Leo/Need": [
    "Hoshino Ichika",
    "Tenma Saki",
    "Mochizuki Honami",
    "Hinomori Shiho",
  ],
  "MORE MORE JUMP!": [
    "Hanasato Minori",
    "Kiritani Haruka",
    "Momoi Airi",
    "Hinomori Shizuku",
  ],
  "Vivid BAD SQUAD": [
    "Azusawa Kohane",
    "Shiraishi An",
    "Shinonome Akito",
    "Aoyagi Toya",
  ],
  "Wonderlands x Showtime": [
    "Tenma Tsukasa",
    "Otori Emu",
    "Kusanagi Nene",
    "Kamishiro Rui",
  ],
  "Nightcord at 25:00": [
    "Yoisaki Kanade",
    "Asahina Mafuyu",
    "Shinonome Ena",
    "Akiyama Mizuki",
  ],
};

const filterCategories = {
  Characters: [
    "Hoshino Ichika",
    "Tenma Saki",
    "Mochizuki Honami",
    "Hinomori Shiho",
    "Hanasato Minori",
    "Kiritani Haruka",
    "Momoi Airi",
    "Hinomori Shizuku",
    "Azusawa Kohane",
    "Shiraishi An",
    "Shinonome Akito",
    "Aoyagi Toya",
    "Tenma Tsukasa",
    "Otori Emu",
    "Kusanagi Nene",
    "Kamishiro Rui",
    "Yoisaki Kanade",
    "Asahina Mafuyu",
    "Shinonome Ena",
    "Akiyama Mizuki",
    "Hatsune Miku",
    "Kagamine Rin",
    "Kagamine Len",
    "Megurine Luka",
    "MEIKO",
    "KAITO",
  ],
  Unit: [
    "Virtual Singers",
    "Leo/Need",
    "MORE MORE JUMP!",
    "Vivid BAD SQUAD",
    "Wonderlands x Showtime",
    "Nightcord at 25:00",
  ],
  Attribute: ["Cute", "Pure", "Mysterious", "Cool", "Happy"],
  Rarity: [1, 2, 3, 4, 5],
};

const bannerFilterCategories = {
  "Banner Type": [
    "Limited Event Rerun",
    "Limited Event",
    "Event",
    "Bloom Festival",
    "Colorful Festival",
    "Limited Collab",
    "Unit Limited Event",
    "Birthday"
  ],
  Characters: filterCategories.Characters,
};

type BannerFilterTypes = {
  "Banner Type": string[];
  Characters: string[];
  search: string;
};

export default function FilterTab() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"banners" | "cards">("banners");
  const [tempFilters, setTempFilters] = useState<SelectedFilterTypes>({
    Character: [],
    Unit: [],
    Attribute: [],
    Rarity: [],
  });

  const [tempBannerFilters, setTempBannerFilters] = useState<BannerFilterTypes>({
    "Banner Type": [],
    Characters: [],
    search: "",
  });

  // APPLIED filters used for actual filtering
  const [selectedCardFilters, setSelectedCardFilters] =
    useState<SelectedFilterTypes>({
      Character: [],
      Unit: [],
      Attribute: [],
      Rarity: [],
    });

  const [selectedBannerFilters, setSelectedBannerFilters] = useState<BannerFilterTypes>({
    "Banner Type": [],
    Characters: [],
    search: "",
  });

  const { theme } = useTheme();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleFilter = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleCardFilters = (category: string, option: string | number) => {
    setTempFilters((prev) => {
      if (category === "Unit") {
        const unit = option as string;
        const isSelected = prev.Unit.includes(unit);

        const updatedUnits = isSelected
          ? prev.Unit.filter((u) => u !== unit)
          : [...prev.Unit, unit];

        // If deselecting, remove characters from deselected unit
        let updatedCharacters = [...prev.Character];

        if (isSelected) {
          const charactersToRemove = grouped[unit] || [];
          updatedCharacters = updatedCharacters.filter(
            (char) => !charactersToRemove.includes(char)
          );
        } else {
          // If selecting new unit, add its characters (but avoid duplicates)
          const newCharacters = grouped[unit] || [];
          updatedCharacters = Array.from(
            new Set([...updatedCharacters, ...newCharacters])
          );
        }

        return {
          ...prev,
          Unit: updatedUnits,
          Character: updatedCharacters,
        };
      }
      if (category === "Characters") {
        const isSelected = prev.Character.includes(option as string);
        const updated = isSelected
          ? prev.Character.filter((name) => name !== option)
          : [...prev.Character, option as string];

        return {
          ...prev,
          Character: updated,
        };
      }

      if (category === "Attribute") {
        const current = prev.Attribute;
        const isSelected = current.includes(option as string);
        const updated = isSelected
          ? current.filter((o) => o !== option)
          : [...current, option as string];
        return {
          ...prev,
          Attribute: updated,
        };
      }

      if (category === "Rarity") {
        const current = prev.Rarity;
        const isSelected = current.includes(option);
        const updated = isSelected
          ? current.filter((o) => o !== option)
          : [...current, option];
        return {
          ...prev,
          Rarity: updated,
        };
      }

      return prev;
    });
  };

  const handleBannerFilters = (category: string, option: string) => {
    setTempBannerFilters((prev) => {
      if (category === "Banner Type") {
        const isSelected = prev["Banner Type"].includes(option);
        const updated = isSelected
          ? prev["Banner Type"].filter((type) => type !== option)
          : [...prev["Banner Type"], option];
        return {
          ...prev,
          "Banner Type": updated,
        };
      }

      if (category === "Characters") {
        const isSelected = prev.Characters.includes(option);
        const updated = isSelected
          ? prev.Characters.filter((char) => char !== option)
          : [...prev.Characters, option];
        return {
          ...prev,
          Characters: updated,
        };
      }

      return prev;
    });
  };

  const handleSearchChange = (searchTerm: string) => {
    setTempBannerFilters((prev) => ({
      ...prev,
      search: searchTerm,
    }));
  };

  const handleReset = () => {
    if (viewMode === "cards") {
      setTempFilters({
        Character: [],
        Unit: [],
        Attribute: [],
        Rarity: [],
      });
    } else {
      setTempBannerFilters({
        "Banner Type": [],
        Characters: [],
        search: "",
      });
    }
  };

  const handleApply = () => {
    if (viewMode === "cards") {
      setSelectedCardFilters(tempFilters);
    } else {
      setSelectedBannerFilters(tempBannerFilters);
    }
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div
        className={`w-full flex  border-b ${
          theme === "light" ? "border-gray-200 bg-[#f5f7f9]" : "border-gray-700"
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
      <div
        className={`p-3 w-full shrink-0  flex flex-col justify-end items-center ${
          theme == "light" ? "bg-bg-light-mode2" : "bg-bg-dark-mode"
        }`}
        ref={panelRef}
      >
        <button onClick={toggleFilter} className="">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke={`${theme == "light" ? "#0a0a0a" : "#fafafa"}`}
            className="size-7 "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
            />
          </svg>
        </button>
        {viewMode == "cards" ? (
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden max-w-[500px] ${
              isOpen ? "max-h-[800px]  opacity-100" : "max-h-0 opacity-0"
            } bg-gray-600 rounded-lg p-1.5`}
          >
            {Object.entries(filterCategories).map(([category, options]) => (
              <div key={category} className="mb-2">
                <h3 className="text-lg font-semibold mb-1">{category}</h3>
                <div className="flex justify-center items-center flex-wrap gap-3">
                  {options.map((option, i) => {
                    const unitIcon = `images/unit_icons/${i + 1}.png`;
                    const characterIcon = `/images/character_icons/${
                      i + 1
                    }.webp`;
                    const attributeIcon = `/images/attribute_icons/${option}.webp`;
                    const rarityIcon = `images/rarity_icons/${i + 1}.webp`;

                    const isSelected = (() => {
                      switch (category) {
                        case "Characters":
                          return tempFilters.Character.includes(
                            option as string
                          );
                        case "Unit":
                          return tempFilters.Unit.includes(option as string);
                        case "Attribute":
                          return tempFilters.Attribute.includes(
                            option as string
                          );
                        case "Rarity":
                          return tempFilters.Rarity.includes(option);
                        default:
                          return false;
                      }
                    })();

                    const isOutsideUnit =
                      category === "Characters" &&
                      tempFilters.Unit.length > 0 &&
                      !tempFilters.Unit.some((unit) =>
                        grouped[unit]?.includes(option as string)
                      ) &&
                      !tempFilters.Character.includes(option as string);
                    return (
                      <button
                        key={option as string}
                        className={` border-2 aspect-square rounded-full ${
                          isSelected ? "border-white" : "border-gray-600"
                        } ${isOutsideUnit ? "opacity-30" : ""}`}
                        onClick={() => handleCardFilters(category, option)}
                      >
                        {category === "Characters" && (
                          <img
                            src={characterIcon}
                            style={{ width: "2.25rem" }}
                          />
                        )}
                        {category === "Unit" && (
                          <img src={unitIcon} style={{ width: "2rem" }} />
                        )}
                        {category === "Attribute" && (
                          <img
                            src={attributeIcon}
                            style={{ width: "1.75rem" }}
                          />
                        )}
                        {category === "Rarity" && (
                          <img src={rarityIcon} style={{ width: "2rem" }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
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
        ) : (
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden max-w-[500px] ${
              isOpen ? "max-h-[800px]  opacity-100" : "max-h-0 opacity-0"
            } bg-gray-600 rounded-lg p-1.5`}
          >
            {/* SEARCH INPUT */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 text-white">Search</h3>
              <input
                type="text"
                placeholder="Mafu4, wl1..."
                value={tempBannerFilters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-500 focus:outline-none focus:border-blue-400"
              />
            </div>

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
              <h3 className="text-lg font-semibold mb-2 text-white">Characters</h3>
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
        )}
      </div>
      <div className="w-full">
        {viewMode == "banners" ? (
          <FilteredBanners selectedFilters={selectedBannerFilters} />
        ) : (
          <FilteredCards selectedFilters={selectedCardFilters} />
        )}
      </div>
    </div>
  );
}