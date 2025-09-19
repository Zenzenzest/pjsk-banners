import { useState, useEffect, useRef } from "react";
import type { CardFilterTypes, BannerFilterTypes } from "./FilterTabTypes";
import { useTheme } from "../../context/Theme_toggle";
import FilteredBanners from "./Banners/Filtered_banners";
import FilteredCards from "./Cards/Filtered_cards";
import WebsiteDisclaimer from "../Server/Website_disclaimer";
import { useServer } from "../../context/Server";
import { grouped } from "./Filter_constants";
import ViewModeTabs from "./Ui/Viewmode_tabs";
import SearchInput from "./Ui/Search_input";
import CardFilters from "./Filters/Card_filters";
import BannerFilters from "./Filters/Banner_filters";

export default function FilterTab() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"banners" | "cards">("banners");
  const [tempCardFilters, setTempCardFilters] = useState<CardFilterTypes>({
    Character: [],
    Unit: [],
    Attribute: [],
    Rarity: [],
    search: "",
    sub_unit: [],
    Type: [],
  });

  const [tempBannerFilters, setTempBannerFilters] = useState<BannerFilterTypes>(
    {
      "Banner Type": [],
      Characters: [],
      search: "",
      characterFilterMode: "all",
    }
  );

  const [selectedCardFilters, setSelectedCardFilters] =
    useState<CardFilterTypes>({
      Character: [],
      Unit: [],
      Attribute: [],
      Rarity: [],
      search: "",
      sub_unit: [],
      Type: [],
    });

  const [selectedBannerFilters, setSelectedBannerFilters] =
    useState<BannerFilterTypes>({
      "Banner Type": [],
      Characters: [],
      search: "",
      characterFilterMode: "all",
    });
  const { server } = useServer();
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
    setTempCardFilters((prev) => {
      if (category === "Unit") {
        const unit = option as string;
        const isSelected = prev.Unit.includes(unit);

        const updatedUnits = isSelected
          ? prev.Unit.filter((u) => u !== unit)
          : [...prev.Unit, unit];

        // If deselecting, remove characters from deselected unit
        let updatedCharacters = [...prev.Character];
        let updatedSubUnit = [...prev.sub_unit];

        if (isSelected) {
          const charactersToRemove = grouped[unit] || [];
          updatedCharacters = updatedCharacters.filter(
            (char) => !charactersToRemove.includes(char)
          );
        } else {
          // If selecting new unit, add its characters
          const newCharacters = grouped[unit] || [];
          updatedCharacters = Array.from(
            new Set([...updatedCharacters, ...newCharacters])
          );
        }

        // Check if any Virtual Singer characters remain selected
        const hasVirtualSingers = updatedCharacters.some((char) =>
          grouped["Virtual Singers"].includes(char)
        );

        // If no Virtual Singer characters are selected, reset sub_unit
        if (!hasVirtualSingers) {
          updatedSubUnit = [];
        }

        return {
          ...prev,
          Unit: updatedUnits,
          Character: updatedCharacters,
          sub_unit: updatedSubUnit,
        };
      }
      if (category === "Characters") {
        const isSelected = prev.Character.includes(option as string);
        const updated = isSelected
          ? prev.Character.filter((name) => name !== option)
          : [...prev.Character, option as string];

        // Check if any Virtual Singer characters remain selected after this change
        const hasVirtualSingersAfterChange = updated.some((char) =>
          grouped["Virtual Singers"].includes(char)
        );

        // If no Virtual Singer characters are selected, reset sub_unit
        const updatedSubUnit = hasVirtualSingersAfterChange
          ? prev.sub_unit
          : [];

        return {
          ...prev,
          Character: updated,
          sub_unit: updatedSubUnit,
        };
      }
      if (category === "sub_unit") {
        const current = prev.sub_unit;
        const isSelected = current.includes(option as string);
        const updated = isSelected
          ? current.filter((o) => o !== option)
          : [...current, option as string];
        return {
          ...prev,
          sub_unit: updated,
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
      if (category === "Type") {
        const current = prev.Type;
        const isSelected = current.includes(option as string);
        const updated = isSelected
          ? current.filter((o) => o !== option)
          : [...current, option as string];
        return {
          ...prev,
          Type: updated,
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

  const handleCharacterFilterModeToggle = () => {
    setTempBannerFilters((prev) => ({
      ...prev,
      characterFilterMode: prev.characterFilterMode === "all" ? "any" : "all",
    }));
  };

  const handleSearchChange = (searchTerm: string) => {
    if (viewMode === "banners") {
      setTempBannerFilters((prev) => ({
        ...prev,
        search: searchTerm,
      }));

      // search immediately
      setSelectedBannerFilters((prev) => ({
        ...prev,
        search: searchTerm,
      }));
    } else {
      setTempCardFilters((prev) => ({
        ...prev,
        search: searchTerm,
      }));

      // search immediately
      setSelectedCardFilters((prev) => ({
        ...prev,
        search: searchTerm,
      }));
    }
  };

  useEffect(() => {
    handleReset();
  }, [server]);

  const handleReset = () => {
    if (viewMode === "cards") {
      setTempCardFilters({
        Character: [],
        Unit: [],
        Attribute: [],
        Rarity: [],
        search: "",
        sub_unit: [],
        Type: [],
      });
    } else {
      setTempBannerFilters({
        "Banner Type": [],
        Characters: [],
        search: "",
        characterFilterMode: "all",
      });
    }

    if (viewMode === "cards") {
      setSelectedCardFilters({
        Character: [],
        Unit: [],
        Attribute: [],
        Rarity: [],
        search: "",
        sub_unit: [],
        Type: [],
      });
    } else {
      setSelectedBannerFilters({
        "Banner Type": [],
        Characters: [],
        search: "",
        characterFilterMode: "all",
      });
    }
    setIsOpen(false);
  };

  const handleApply = () => {
    if (viewMode === "cards") {
      setSelectedCardFilters(tempCardFilters);
    } else {
      setSelectedBannerFilters(tempBannerFilters);
    }

    setIsOpen(false);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      {/* VIEWMODE TABS */}

      <ViewModeTabs setViewMode={setViewMode} viewMode={viewMode} />

      {/* SEARCH INPUT */}
      <SearchInput
        viewMode={viewMode}
        selectedBannerFilters={selectedBannerFilters}
        selectedCardFilters={selectedCardFilters}
        handleSearchChange={handleSearchChange}
      />

      {/* FILTERS */}
      <div
        className={`p-3 w-full shrink-0  flex flex-col justify-end items-center ${
          theme == "light" ? "bg-[#f9fafb]" : "bg-[#101828]"
        }`}
        ref={panelRef}
      >
        {/* FILTER BUTTON */}
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
        {/* CARDS FILTERS */}
        {viewMode == "cards" ? (
          <CardFilters
            isOpen={isOpen}
            tempCardFilters={tempCardFilters}
            handleCardFilters={handleCardFilters}
            handleReset={handleReset}
            handleApply={handleApply}
          />
        ) : (
          <BannerFilters
            isOpen={isOpen}
            tempBannerFilters={tempBannerFilters}
            handleBannerFilters={handleBannerFilters}
            handleReset={handleReset}
            handleApply={handleApply}
            handleCharacterFilterModeToggle={handleCharacterFilterModeToggle}
          />
        )}
      </div>
      <div className="w-full">
        {viewMode == "banners" ? (
          <FilteredBanners selectedBannerFilters={selectedBannerFilters} />
        ) : (
          <FilteredCards selectedCardFilters={selectedCardFilters} />
        )}
      </div>
      <WebsiteDisclaimer />
    </div>
  );
}
