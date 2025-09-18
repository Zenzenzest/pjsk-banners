import { useState, useMemo, useCallback } from "react";
import { AllCharacters } from "../../Counter_constants";
import { SUB_UNITS, VS } from "../../../../constants/common";
import type { AllCardTypes } from "../../../../types/common";

import ProcessCardData from "../../process_card";
import { notAllowedTypes } from "../../Counter_constants";
import type { CharacterData } from "../../CounterTypes";
import type { SortColumn, SortDirection } from "../CounterTableTypes";
import { useProsekaData } from "../../../../context/Data";

const formatCardDate = (card: AllCardTypes | undefined, server: string) => {
  if (!card) return ["N/A", 0, 0];

  const date = new Date(server === "jp" ? card.jp_released : card.en_released);

  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return [formattedDate, card.id, card.rarity];
};

export const useCardTable = (server: string, today: number) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(true);
  const [cardId, setCardId] = useState(0);
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("default");
  const [showVirtualSingers, setShowVirtualSingers] = useState(true);
  const [showLN, setShowLN] = useState(true);
  const [showMMJ, setShowMMJ] = useState(true);
  const [showVBS, setShowVBS] = useState(true);
  const [showWxS, setShowWxS] = useState(true);
  const [showN25, setShowN25] = useState(true);
  const { allCards } = useProsekaData();

  const handleCardClick = (cardId: number) => {
    setCardId(cardId);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsLoading(true);
    setIsLoading2(true);
    setIsOpen(false);
  };

  const getCharacterId = useCallback((card: AllCardTypes) => {
    const isVirtualSinger = card.unit === "Virtual Singers";

    if (!isVirtualSinger || !card.sub_unit) {
      return AllCharacters.indexOf(card.character) + 1;
    }

    const vsId = AllCharacters.indexOf(card.character) + 1;
    const vsIndex = VS.indexOf(card.character) + 1;
    const groupIndex = SUB_UNITS.indexOf(card.sub_unit) + 1;

    return vsId + 4 * vsIndex + 1 + groupIndex;
  }, []);

  const createCharCode = useCallback(
    (characterId: number, cardType: string, rarity: number) =>
      `${characterId}-${cardType}-${rarity}`,
    []
  );

  const shouldIncludeUnit = (card: AllCardTypes) => {
    const unitFilters = {
      "Virtual Singers": showVirtualSingers,
      "Leo/Need": showLN,
      "MORE MORE JUMP!": showMMJ,
      "Vivid BAD SQUAD": showVBS,
      "Wonderlands x Showtime": showWxS,
      "Nightcord at 25:00": showN25,
    };

    // Check if non VS units are enabled
    const otherUnitsEnabled =
      showLN || showMMJ || showVBS || showWxS || showN25;

    if (card.unit === "Virtual Singers") {
      // If other unit is selected
      if (otherUnitsEnabled) {
        // If VS is also selected AND card has sub_unit, check if sub_unit matches any selected unit
        if (showVirtualSingers && card.sub_unit) {
          const subUnitFilter =
            unitFilters[card.sub_unit as keyof typeof unitFilters];
          return subUnitFilter !== undefined && subUnitFilter;
        }

        return false;
      }
      // If only VS is selected, show all VS cards
      else {
        return showVirtualSingers;
      }
    }

    // For non VS, check main unit filter
    const unitFilter = unitFilters[card.unit as keyof typeof unitFilters];
    if (unitFilter !== undefined && !unitFilter) {
      return false;
    }

    return true;
  };


  
  const getLastCardByRarity = (
    cardType: string,
    charId: number,
    rarity: number,
    server: string,
    today: number,
    excludedTypes: string[]
  ) => {
    return allCards.findLast((card) => {
      const isReleased =
        server === "jp"
          ? today > (card.jp_released ?? 0)
          : today > (card.en_released ?? 0);
      const isAllowed = !excludedTypes.includes(card.card_type);
      const isRarityMatch = card.rarity === rarity;
      const isLim4 = card.card_type === "limited";
      if (cardType === "permanent") {
        return (
          isReleased &&
          card.charId === charId &&
          isAllowed &&
          isRarityMatch &&
          !isLim4
        );
      } else if (cardType === "limited") {
        return (
          isReleased &&
          card.charId === charId &&
          isAllowed &&
          isRarityMatch &&
          isLim4
        );
      }
    });
  };

  const processedData = useMemo(() => {
    const charactersCounter: { [key: string]: number } = {};
    const allowedCardTypes = new Set(["permanent", "limited"]);

    allCards.forEach((card) => {
      const isReleased =
        server === "jp" ? today > card.jp_released : today > card.en_released;

      const shouldInclude = shouldIncludeUnit(card);

      if (
        !allowedCardTypes.has(card.card_type) ||
        card.rarity === 1 ||
        !isReleased ||
        (card.unit === "Virtual Singers" && !card.sub_unit) ||
        !shouldInclude
      ) {
        return;
      }

      const characterId = getCharacterId(card);
      const charCode = createCharCode(characterId, card.card_type, card.rarity);

      charactersCounter[charCode] = (charactersCounter[charCode] ?? 0) + 1;
    });

    const cardData = Object.entries(charactersCounter).map(([key, count]) => ({
      charId: key.split("-")[0],
      rarity: parseInt(key.split("-")[2]) as 2 | 3 | 4,
      card_type: key.split("-")[1] as "permanent" | "limited",
      count: Number(count),
    }));

    return ProcessCardData(cardData);
  }, [
    server,
    today,
    getCharacterId,
    createCharCode,
    showVirtualSingers,
    showLN,
    showMMJ,
    showVBS,
    showWxS,
    showN25,
  ]);

  const categoryMaxCounts = useMemo(() => {
    const maxCounts: Record<string, number> = {
      "4-limited": 0,
      "4-permanent": 0,
      "3-permanent": 0,
      "2-permanent": 0,
    };

    processedData.forEach((character) => {
      character.cardBreakdown.forEach((card) => {
        const key = `${card.rarity}-${
          card.isLimited ? "limited" : "permanent"
        }`;
        if (card.count > (maxCounts[key] || 0)) {
          maxCounts[key] = card.count;
        }
      });
    });

    Object.keys(maxCounts).forEach((key) => {
      if (maxCounts[key] === 0) maxCounts[key] = 1;
    });

    return maxCounts;
  }, [processedData]);

  const processedDataWithSorting = useMemo(() => {
    return processedData.map((character) => {
      const allCardTypes = [
        { rarity: 4, isLimited: true },
        { rarity: 4, isLimited: false },
        { rarity: 3, isLimited: false },
        { rarity: 2, isLimited: false },
      ];

      const cardDataMap = new Map(
        character.cardBreakdown.map((card) => [
          `${card.rarity}-${card.isLimited}`,
          card.count,
        ])
      );

      const sortedCardBreakdown = allCardTypes
        .map((type) => ({
          ...type,
          count: cardDataMap.get(`${type.rarity}-${type.isLimited}`) || 0,
        }))
        .sort((a, b) => {
          if (a.rarity === 4 && a.isLimited) return -1;
          if (b.rarity === 4 && b.isLimited) return 1;
          if (a.rarity !== b.rarity) return b.rarity - a.rarity;
          if (a.isLimited !== b.isLimited) return b.isLimited ? 1 : -1;
          return 0;
        });

      return {
        ...character,
        sortedCardBreakdown,
      };
    });
  }, [processedData]);

  const processedDataWithLastCards = useMemo((): CharacterData[] => {
    return processedDataWithSorting.map((character) => {
      const last4LimCard = getLastCardByRarity(
        "limited",
        character.id,
        4,
        server,
        today,
        notAllowedTypes
      );
      const last4PermCard = getLastCardByRarity(
        "permanent",
        character.id,
        4,
        server,
        today,
        notAllowedTypes
      );
      const last3Card = getLastCardByRarity(
        "permanent",
        character.id,
        3,
        server,
        today,
        notAllowedTypes
      );
      const last2Card = getLastCardByRarity(
        "permanent",
        character.id,
        2,
        server,
        today,
        notAllowedTypes
      );

      const lastCards = [
        formatCardDate(last4LimCard, server),
        formatCardDate(last4PermCard, server),
        formatCardDate(last3Card, server),
        formatCardDate(last2Card, server),
      ];

      return {
        ...character,
        lastCards,
      };
    });
  }, [processedDataWithSorting, server, today]);

  const sortedData = useMemo(() => {
    if (!sortColumn || sortDirection === "default") {
      return processedDataWithLastCards;
    }

    return [...processedDataWithLastCards].sort((a, b) => {
      let aValue: string | number, bValue: string | number;

      switch (sortColumn) {
        case "character":
          aValue = a.name;
          bValue = b.name;
          break;
        case "total":
          aValue = a.totalCount;
          bValue = b.totalCount;
          break;
        case "4-limited":
          aValue = a.sortedCardBreakdown[0]?.count || 0;
          bValue = b.sortedCardBreakdown[0]?.count || 0;
          break;
        case "4-permanent":
          aValue = a.sortedCardBreakdown[1]?.count || 0;
          bValue = b.sortedCardBreakdown[1]?.count || 0;
          break;
        case "3-permanent":
          aValue = a.sortedCardBreakdown[2]?.count || 0;
          bValue = b.sortedCardBreakdown[2]?.count || 0;
          break;
        case "2-permanent":
          aValue = a.sortedCardBreakdown[3]?.count || 0;
          bValue = b.sortedCardBreakdown[3]?.count || 0;
          break;
        default:
          return 0;
      }

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [processedDataWithLastCards, sortColumn, sortDirection]);

  const getRarityBarColor = (rarity: number, isLimited: boolean) => {
    if (isLimited && rarity === 4) return "bg-yellow-500";
    switch (rarity) {
      case 2:
        return "bg-blue-500";
      case 3:
        return "bg-purple-500";
      case 4:
        return "bg-pink-500";
      default:
        return "bg-gray-400";
    }
  };

  const getMaxCountForCategory = (rarity: number, isLimited: boolean) => {
    const key = `${rarity}-${isLimited ? "limited" : "permanent"}`;
    return categoryMaxCounts[key] || 1;
  };

  const handleSort = (column: SortColumn, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (sortColumn === column) {
      if (sortDirection === "default") {
        setSortDirection("asc");
      } else if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortColumn(null);
        setSortDirection("default");
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortIndicator = (column: SortColumn) => {
    if (sortColumn !== column) {
      return (
        <svg
          className="ml-1 w-4 h-4 sm:w-3 sm:h-3 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }

    if (sortDirection === "asc") {
      return (
        <svg
          className="ml-1 w-4 h-4 sm:w-3 sm:h-3 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      );
    } else if (sortDirection === "desc") {
      return (
        <svg
          className="ml-1 w-4 h-4 sm:w-3 sm:h-3 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      );
    }
    return null;
  };

  return {
    // state
    isOpen,
    setIsOpen,
    isLoading,
    setIsLoading,
    isLoading2,
    setIsLoading2,
    cardId,
    setCardId,
    sortColumn,
    setSortColumn,
    sortDirection,
    setSortDirection,
    showVirtualSingers,
    setShowVirtualSingers,
    showLN,
    setShowLN,
    showMMJ,
    setShowMMJ,
    showVBS,
    setShowVBS,
    showWxS,
    setShowWxS,
    showN25,
    setShowN25,

    // data
    sortedData,
    categoryMaxCounts,

    // functions
    handleCardClick,
    handleCloseModal,
    getRarityBarColor,
    getMaxCountForCategory,
    handleSort,
    getSortIndicator,
  };
};
