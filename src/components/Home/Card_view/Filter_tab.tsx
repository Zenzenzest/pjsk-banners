import { useState, useEffect, useRef } from "react";
import type { SelectedFilterTypes } from "../types";
import { useTheme } from "../../../context/Theme_toggle";

import FilteredCards from "./Filtered_cards";

const grouped = {
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
    "Hatsune Miku",
    "Kagamine Rin",
    "Kagamine Len",
    "Megurine Luka",
    "MEIKO",
    "KAITO",
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

export default function FilterTab() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tempFilters, setTempFilters] = useState<SelectedFilterTypes>({
    Character: [],
    Unit: null,
    Attribute: [],
    Rarity: [],
  });

  // APPLIED filters used for actual filtering
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilterTypes>({
    Character: [],
    Unit: null,
    Attribute: [],
    Rarity: [],
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

  const handleSelect = (category: string, option: string | number) => {
    setTempFilters((prev) => {
      if (category === "Unit") {
        if (prev.Unit === option) {
          return {
            ...prev,
            Unit: null,
            Character: [],
          };
        }
        const characters = grouped[option as keyof typeof grouped] || [];
        return {
          ...prev,
          Unit: option as string,
          Character: characters,
        };
      }
      if (category === "Characters") {
        // Use the currently selected unit in tempFilters, not prev.Unit
        const unit = tempFilters.Unit;

        // Don't allow selecting characters from a different unit (if one is selected)
        if (unit && !grouped[unit]?.includes(option as string)) {
          return prev; // Skip this character if it's outside the selected unit
        }

        const isSelected = prev.Character.includes(option as string);
        const newCharacterList = isSelected
          ? prev.Character.filter((name) => name !== option)
          : [...prev.Character, option as string];

        return {
          ...prev,
          Character: newCharacterList,
        };
      }

      if (category === "Attribute" || category === "Rarity") {
        const current = prev[category] as string[] | number[];
        const isSelected = current.includes(option);
        const updated = isSelected
          ? current.filter((o) => o !== option)
          : [...current, option];
        return {
          ...prev,
          [category]: updated,
        };
      }

      return {
        ...prev,
        [category]: option,
      };
    });
  };

  const handleReset = () => {
    setTempFilters({
      Character: [],
      Unit: null,
      Attribute: [],
      Rarity: [],
    });
  };

  const handleApply = () => {
    setSelectedFilters(tempFilters);
    setIsOpen(false);
  };

  return (
    <div
      className={`p-3 w-full h-auto flex flex-col justify-start items-center ${
        theme == "light" ? "bg-bg-light-mode2" : "bg-bg-dark-mode2"
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
                const characterIcon = `/images/character_icons/${i + 1}.webp`;
                const attributeIcon = `/images/attribute_icons/${option}.webp`;
                const rarityIcon = `images/rarity_icons/${i + 1}.webp`;

                const isSelected =
                  category === "Characters"
                    ? tempFilters.Character.includes(option)
                    : Array.isArray(tempFilters[category])
                    ? tempFilters[category].includes(option)
                    : tempFilters[category] === option;

                const isDisabled =
                  category === "Characters" &&
                  tempFilters.Unit &&
                  !grouped[tempFilters.Unit]?.includes(option);

                return (
                  <button
                    key={option as string}
                    disabled={isDisabled}
                    className={`border border-2 aspect-square rounded-full ${
                      isSelected ? "border-white" : "border-gray-600"
                    } ${isDisabled ? "opacity-30 pointer-events-none" : ""}`}
                    onClick={() => handleSelect(category, option)}
                  >
                    {category === "Characters" && (
                      <img src={characterIcon} style={{ width: "2.25rem" }} />
                    )}
                    {category === "Unit" && (
                      <img src={unitIcon} style={{ width: "2rem" }} />
                    )}
                    {category === "Attribute" && (
                      <img src={attributeIcon} style={{ width: "1.75rem" }} />
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
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Reset Filters
          </button>
          <button
            onClick={handleApply}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Apply
          </button>
        </div>
      </div>

      <div>
        <FilteredCards selectedFilters={selectedFilters} />
      </div>
    </div>
  );
}
