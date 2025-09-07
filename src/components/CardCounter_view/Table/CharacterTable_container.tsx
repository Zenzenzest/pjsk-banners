import type { AllCardTypes } from "../../../types/common";
import AllCards from "../../../assets/json/cards.json";
import { useState, useMemo, useCallback } from "react";
import { AllCharacters } from "../Counter_constants";
import { useServer } from "../../../context/Server";
import ProcessCardData from "../process_card";
import { useTheme } from "../../../context/Theme_toggle";
import WebsiteDisclaimer from "../../Nav/Website_disclaimer";
import { SUB_UNITS, VS } from "../../../constants/common";
import { notAllowedTypes } from "../Counter_constants";
import type { CharacterData } from "../CounterTypes";
import CardModal from "../../Modal/Card/Card_modal";

type SortDirection = "asc" | "desc" | "default";
type SortColumn =
  | "character"
  | "total"
  | "4-limited"
  | "4-permanent"
  | "3-permanent"
  | "2-permanent"
  | null;

const getLastCardByRarity = (
  cardType: string,
  charId: number,
  rarity: number,
  server: string,
  today: number,
  excludedTypes: string[]
) => {
  return AllCards.findLast((card) => {
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

const formatCardDate = (card: AllCardTypes | undefined, server: string) => {
  if (!card) return ["N/A", 0, 0]; // [date, id, rarity]

  const date = new Date(server === "jp" ? card.jp_released : card.en_released);

  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return [formattedDate, card.id, card.rarity];
};

export default function CardTable() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(true);
  const [cardId, setCardId] = useState(0);
  const { server } = useServer();
  const { theme } = useTheme();
  const today = Date.now();

  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("default");
  const [showVirtualSingers, setShowVirtualSingers] = useState(true);
  const [showLN, setShowLN] = useState(true);
  const [showMMJ, setShowMMJ] = useState(true);
  const [showVBS, setShowVBS] = useState(true);
  const [showWxS, setShowWxS] = useState(true);
  const [showN25, setShowN25] = useState(true);

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

    //check if card's unit should be included
    const unitFilter = unitFilters[card.unit as keyof typeof unitFilters];
    if (unitFilter !== undefined && !unitFilter) {
      return false;
    }

    // if card sub_unit should be included (if it exists)
    if (card.sub_unit) {
      const subUnitFilter =
        unitFilters[card.sub_unit as keyof typeof unitFilters];
      if (subUnitFilter !== undefined && !subUnitFilter) {
        return false;
      }
    }

    return true;
  };
  const processedData = useMemo(() => {
    const charactersCounter: { [key: string]: number } = {};
    const allowedCardTypes = new Set(["permanent", "limited"]);

    AllCards.forEach((card) => {
      const isReleased =
        server === "jp" ? today > card.jp_released : today > card.en_released;

      // filter out Virtual Singers if checkbox is unchecked
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
    getCharacterId,
    createCharCode,
    showVirtualSingers,
    showLN,
    showMMJ,
    showVBS,
    showWxS,
    showN25,
  ]);

  // Calculate max counts for each card category
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

    // ensure minimum value of 1
    // to avoid division by zero
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

  // Sort data based on toggled sort state
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
      // cycle through sort states
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

  return (
    <div
      className={`p-4 transition-all duration-300 ease-in-out ${
        theme === "dark" ? "bg-[#101828]" : "bg-[#f9fafb]"
      }`}
    >
      <div className="mb-6 text-center">
        <h1
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-gray-200" : "text-gray-600"
          }  `}
        >
          Attributes breakdown wip
        </h1>
      </div>

      {/* FILTERS */}

      <div className="mb-4 flex flex-wrap justify-center gap-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showVirtualSingers}
            onChange={(e) => setShowVirtualSingers(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span
            className={`text-sm font-medium ${
              theme === "dark" ? "text-gray-200" : "text-gray-600"
            } `}
          >
            Virtual Singers
          </span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showLN}
            onChange={(e) => setShowLN(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span
            className={`text-sm font-medium ${
              theme === "dark" ? "text-gray-200" : "text-gray-600"
            } `}
          >
            L/n
          </span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showMMJ}
            onChange={(e) => setShowMMJ(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span
            className={`text-sm font-medium ${
              theme === "dark" ? "text-gray-200" : "text-gray-600"
            } `}
          >
            MMJ
          </span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showVBS}
            onChange={(e) => setShowVBS(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span
            className={`text-sm font-medium ${
              theme === "dark" ? "text-gray-200" : "text-gray-600"
            } `}
          >
            VBS
          </span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showWxS}
            onChange={(e) => setShowWxS(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span
            className={`text-sm font-medium ${
              theme === "dark" ? "text-gray-200" : "text-gray-600"
            } `}
          >
            WxS
          </span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showN25}
            onChange={(e) => setShowN25(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span
            className={`text-sm font-medium ${
              theme === "dark" ? "text-gray-200" : "text-gray-600"
            } `}
          >
            N25
          </span>
        </label>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="overflow-auto max-h-[90vh]">
          <table className="min-w-full bg-white dark:bg-gray-800">
            {/* COLUMN HEADERS */}
            <thead className="sticky top-0 z-20">
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th
                  className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-0 sticky left-0 bg-gray-50 dark:bg-gray-700 w-20"
                  onClick={(e) => handleSort("character", e)}
                  tabIndex={-1}
                >
                  <div className="flex items-center">
                    Char
                    {getSortIndicator("character")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-0"
                  onClick={(e) => handleSort("total", e)}
                  tabIndex={-1}
                >
                  <div className="flex items-center justify-center">
                    Total
                    {getSortIndicator("total")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 focus:outline-none focus:ring-0"
                  onClick={(e) => handleSort("4-limited", e)}
                  tabIndex={-1}
                >
                  <div className="flex items-center justify-center">
                    4★ Limited
                    {getSortIndicator("4-limited")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 focus:outline-none focus:ring-0"
                  onClick={(e) => handleSort("4-permanent", e)}
                  tabIndex={-1}
                >
                  <div className="flex items-center justify-center">
                    4★ Permanent
                    {getSortIndicator("4-permanent")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/50 focus:outline-none focus:ring-0"
                  onClick={(e) => handleSort("3-permanent", e)}
                  tabIndex={-1}
                >
                  <div className="flex items-center justify-center">
                    3★
                    {getSortIndicator("3-permanent")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-medium text-pink-600 dark:text-pink-400 uppercase tracking-wider cursor-pointer hover:bg-pink-100 dark:hover:bg-pink-900/50 focus:outline-none focus:ring-0"
                  onClick={(e) => handleSort("2-permanent", e)}
                  tabIndex={-1}
                >
                  <div className="flex items-center justify-center">
                    2★
                    {getSortIndicator("2-permanent")}
                  </div>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Last 4★ Limited
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Last 4★ Permanent
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Last 3★
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Last 2★
                </th>
              </tr>
            </thead>

            {/* COLUMN DATA */}
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedData.map((character) => (
                <tr
                  key={character.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  {/* CHARACTER ICONS */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-gray-800 ">
                    <img
                      src={`/images/character_icons_extra/${
                        AllCharacters.indexOf(character.name) + 1
                      }.webp`}
                      alt={character.name}
                      className="w-10 h-10 lg:w-13 lg:h-13  object-contain m-auto"
                      loading="lazy"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-bold text-gray-900 dark:text-white">
                    {character.totalCount}
                  </td>

                  {character.sortedCardBreakdown.map((card, index) => {
                    const maxCount = getMaxCountForCategory(
                      card.rarity,
                      card.isLimited
                    );
                    const percentage = (card.count / maxCount) * 100;

                    return (
                      <td
                        key={index}
                        className="px-4 py-3 whitespace-nowrap text-sm text-center"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getRarityBarColor(
                                card.rarity,
                                card.isLimited
                              )}`}
                              style={{
                                width: `${Math.min(100, percentage)}%`,
                              }}
                            ></div>
                          </div>
                          <span className="font-medium w-6 text-center">
                            {card.count}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                  {/* LAST CARDS DATE AND ICON */}
                  {character.lastCards.map((card, index) => {
                    const isCardData = Array.isArray(card) && card.length >= 3;
                    const cardId = isCardData ? card[1] : 0;
                    const cardRarity = isCardData ? card[2] : 0;
                    const dateText = isCardData ? card[0] : card;

                    const iconSrc =
                      cardRarity === 2
                        ? `/images/card_icons/${cardId}.webp`
                        : `/images/card_icons/${cardId}_t.webp`;

                    return (
                      <td
                        key={index}
                        className="px-4 py-3 whitespace-nowrap text-xs min-w-[150px] text-center text-gray-500 dark:text-gray-400"
                      >
                        <div className="flex items-center justify-center space-x-1 ">
                          <span className="min-w-[90px]">{dateText}</span>
                          {isCardData && Number(cardId) > 0 && (
                            <img
                              src={iconSrc}
                              alt={`Card ${cardId}`}
                              className="w-10 h-10 lg:w-13 lg:h-13 transition-transform hover:scale-105  duration-200  hover:opacity-80  cursor-pointer rounded-lg"
                              loading="lazy"
                              onClick={() => handleCardClick(Number(cardId))}
                            />
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <CardModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        cardId={cardId}
        isLoading={isLoading}
        isLoading2={isLoading2}
        setIsLoading={setIsLoading}
        setIsLoading2={setIsLoading2}
      />
      <WebsiteDisclaimer />
    </div>
  );
}
