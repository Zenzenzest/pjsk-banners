import type { AllCardTypes } from "../../../types/common";
import AllCards from "../../../assets/json/cards.json";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import CharacterGrid from "./Character_grid";
import { AllCharacters } from "../Counter_constants";
import { useServer } from "../../../context/Server";
import ProcessCardData from "../process_card";
import { useTheme } from "../../../context/Theme_toggle";
import WebsiteDisclaimer from "../../Nav/Website_disclaimer";
import { SUB_UNITS, VS } from "../../../constants/common";

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
    } else {
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
  if (!card) return "N/A";

  const date = new Date(server === "jp" ? card.jp_released : card.en_released);

  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return [formattedDate, card.id];
};

export default function CounterContainer() {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { isMobile, isVerySmol } = useMemo(
    () => ({
      isMobile: windowWidth < 520,
      isVerySmol: windowWidth < 465,
    }),
    [windowWidth]
  );

  const { server } = useServer();
  const { theme } = useTheme();
  const today = Date.now();
  const notAllowedTypes = ["movie_exclusive", "bday", "limited_collab"];

  const getCharacterId = useCallback((card: AllCardTypes) => {
    const isVirtualSinger = card.unit === "Virtual Singers";

    if (!isVirtualSinger || !card.sub_unit) {
      return AllCharacters.indexOf(card.character) + 1;
    }

    // VS with sub_unit
    const vsId = AllCharacters.indexOf(card.character) + 1;
    const vsIndex = VS.indexOf(card.character) + 1;
    const groupIndex = SUB_UNITS.indexOf(card.sub_unit) + 1;

    return vsId + 4 * vsIndex + 1 + groupIndex;
  }, []);

  const countRef = useRef<HTMLDivElement>(null);

  // scroll and resize handlers
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight;
      const isAwayFromTheTop = scrollTop > documentHeight * 0.1;
      setShowScrollButton(isAwayFromTheTop);
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const scrollToTop = useCallback(() => {
    if (countRef.current) {
      countRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const createCharCode = useCallback(
    (characterId: number, cardType: string, rarity: number) =>
      `${characterId}-${cardType}-${rarity}`,
    []
  );

  const processedData = useMemo(() => {
    const charactersCounter: { [key: string]: number } = {};
    const allowedCardTypes = new Set(["permanent", "limited"]);
    const today = Date.now();

    AllCards.forEach((card) => {
      const isReleased =
        server === "jp" ? today > card.jp_released : today > card.en_released;
      if (
        !allowedCardTypes.has(card.card_type) ||
        card.rarity === 1 ||
        !isReleased ||
        (card.unit === "Virtual Singers" && !card.sub_unit)
      ) {
        return;
      }

      const characterId = getCharacterId(card);
      const charCode = createCharCode(characterId, card.card_type, card.rarity);

      // increment counter
      charactersCounter[charCode] = (charactersCounter[charCode] ?? 0) + 1;
    });

    const cardData = Object.entries(charactersCounter).map(([key, count]) => ({
      charId: key.split("-")[0],
      rarity: parseInt(key.split("-")[2]) as 2 | 3 | 4,
      card_type: key.split("-")[1] as "permanent" | "limited",
      count: Number(count),
    }));

    return ProcessCardData(cardData);
  }, [server, getCharacterId, createCharCode]);

  const processedDataWithSorting = useMemo(() => {
    return processedData.map((character) => {
      // sorting
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

      const maxCount = Math.max(
        ...character.cardBreakdown.map((c) => c.count),
        1
      );

      return {
        ...character,
        sortedCardBreakdown,
        maxCount,
      };
    });
  }, [processedData]);

  // Pre-compute last cards data
  const processedDataWithLastCards = useMemo(() => {
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
  console.log(processedDataWithLastCards);
  return (
    <div
      className={`p-4 flex flex-col justify-center items-center transition-all duration-300 ease-in-out ${
        theme === "dark" ? "bg-[#101828]" : "bg-[#f9fafb]"
      } `}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white ">Character Card Count</h1>
        <p className="text-gray-400"></p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-row justify-center items-center gap-5 p-10">
        <h1>FILTERS WIP</h1>
      </div>

      <div
        className={`grid ${
          isMobile ? "grid-cols-2" : "grid-cols-2"
        } max-w-5xl sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-2 mb-5`}
      >
        {processedDataWithLastCards.map((character) => (
          <CharacterGrid
            key={character.id}
            character={character}
            isMobile={isMobile}
            isVerySmol={isVerySmol}
          />
        ))}
      </div>

      {/* SCROLL TO TOP BUTTON */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
            theme === "dark"
              ? "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200"
              : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
          }`}
          aria-label="Scroll to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
      <WebsiteDisclaimer />
    </div>
  );
}
