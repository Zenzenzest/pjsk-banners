import type { AllCardTypes, CharacterCardData } from "./CounterTypes";
import AllCards from "../../assets/json/cards.json";
import { RARITY_COLORS } from "./config";
import { useServer } from "../../context/Server";
import { useState, useRef, useEffect } from "react";
import "./Character_grid_styles.css";
import { IsDeviceIpad } from "../../hooks/isIpad";

export default function CharacterCardCounter({
  character,
  isMobile,
  isVerySmol,
}: {
  character: CharacterCardData & {
    sortedCardBreakdown: Array<{
      rarity: number;
      isLimited: boolean;
      count: number;
    }>;
    maxCount: number;
  };
  isMobile: boolean;
  isVerySmol: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [collapsedHeight, setCollapsedHeight] = useState<string>("auto");
  const [isMounted, setIsMounted] = useState(false);
  const today = Date.now();
  const { server } = useServer();
  const isIpad = IsDeviceIpad();
  // Get the collapsed height
  useEffect(() => {
    // ensure DOM is fully rendered
    const timer = requestAnimationFrame(() => {
      if (overlayRef.current) {
        const height = overlayRef.current.offsetHeight;
        setCollapsedHeight(`${height}px`);
        setIsMounted(true);
      }
    });

    return () => {
      cancelAnimationFrame(timer);
    };
  }, []);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getRarityBarColor = (rarity: number) =>
    RARITY_COLORS[rarity] || "bg-gray-400";

  const getStarIcon = (rarity: number, isLimited: boolean) => {
    const iconPath =
      isLimited && rarity === 4
        ? "/images/rarity_icons/trained_star.png"
        : "/images/rarity_icons/untrained_star.png";

    return (
      <img
        src={iconPath}
        alt={`${isLimited ? "Limited" : "Permanent"} star`}
        className="w-4 h-4"
      />
    );
  };

  const sortedCardBreakdown = character.sortedCardBreakdown;
  const maxCount = character.maxCount;
  const portraitImg = `/images/cutouts/${character.id}.webp`;

  const notAllowedTypes = ["movie_exclusive", "bday", "limited_collab"];

  //  helper to avoid repetition
  const getLastCardByRarity = (
    cards: AllCardTypes[],
    charId: number,
    rarity: number,
    server: string,
    today: number,
    excludedTypes: string[]
  ) => {
    return cards.findLast((card) => {
      const isReleased =
        server === "jp"
          ? today > (card.jp_released ?? 0)
          : today > (card.en_released ?? 0);
      const isAllowed = !excludedTypes.includes(card.card_type);
      const isRarityMatch = card.rarity === rarity;
      return isReleased && card.charId === charId && isAllowed && isRarityMatch;
    });
  };

  //  date formatting
  const formatCardDate = (card: AllCardTypes | undefined, server: string) => {
    if (!card) return "N/A";

    const date = new Date(
      server === "jp" ? card.jp_released : card.en_released
    );
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const last4Card = getLastCardByRarity(
    AllCards,
    character.id,
    4,
    server,
    today,
    notAllowedTypes
  );
  const last3Card = getLastCardByRarity(
    AllCards,
    character.id,
    3,
    server,
    today,
    notAllowedTypes
  );
  const last2Card = getLastCardByRarity(
    AllCards,
    character.id,
    2,
    server,
    today,
    notAllowedTypes
  );

  const formattedLast4CardDate = formatCardDate(last4Card, server);
  const formattedLast3CardDate = formatCardDate(last3Card, server);
  const formattedLast2CardDate = formatCardDate(last2Card, server);
  const lastCards = [
    formattedLast4CardDate,
    formattedLast3CardDate,
    formattedLast2CardDate,
  ];
  return (
    <div
      className={`${
        isMobile ? "min-h-[325px]" : "h-[450px]"
      } max-w-[264px] rounded-xl overflow-hidden 
     transition-all duration-200 hover:opacity-90 relative cursor-pointer
     border-2 border-blue-500/30`}
    >
      {/* PORTRAIT IMAGE*/}
      <div className="relative h-full">
        <img
          src={portraitImg}
          width={264}
          height={isMobile ? 325 : 450}
          className="w-full h-full object-cover rounded-t-xl"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* OVERLAY CONTAINER */}
      <div className="overlay-container" onClick={handleToggleExpand}>
        {/* GLASS OVERLAY */}
        <div
          ref={overlayRef}
          className={`glass-overlay ${isExpanded ? "expanded" : ""}`}
          style={
            {
              "--overlay-height": isMounted
                ? isExpanded
                  ? "100%"
                  : collapsedHeight
                : isIpad || !isMobile
                ? "40%"
                : "50%",
            } as React.CSSProperties
          }
        >
          <div className="space-y-1 h-full flex flex-col">
            {/* ARROW ICON */}
            <div className="flex justify-end mx-auto">
              <button
                className="expand-button"
                aria-label={isExpanded ? "Collapse" : "Expand"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`arrow-icon ${isExpanded ? "expanded" : ""}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* CHARACTER NAME */}
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-white text-sm truncate">
                {character.name}
              </h3>
              {/* TOTAL COUNT */}
              <span className="text-xs text-gray-200 bg-blue-700/80 px-2 py-1 rounded">
                {character.totalCount}
              </span>
            </div>

            {/* CARD BREAKDOWN  */}
            <div className="space-y-1 flex-grow   overflow-hidden">
              {sortedCardBreakdown.map((card, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    {getStarIcon(card.rarity, card.isLimited)}
                    {!isVerySmol ? (
                      <span className="text-sm text-gray-300">
                        {card.rarity}★{" "}
                        {card.isLimited ? "Limited" : "Permanent"}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300">
                        {card.rarity}★ {card.isLimited ? "L" : "P"}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* BAR VISUALIZATION*/}
                    <div className={`w-10 bg-gray-700/50 rounded-full h-1.5`}>
                      <div
                        className={`h-1.5 rounded-full ${
                          card.isLimited
                            ? "bg-yellow-500"
                            : getRarityBarColor(card.rarity)
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            (card.count / maxCount) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>

                    {/* COUNT */}
                    <span className="text-xs font-medium text-white w-6 text-right">
                      {card.count}
                    </span>
                  </div>
                </div>
              ))}
              {/* MISC */}
              {isExpanded && (
                <div className="flex flex-col mt-5 text-xs sm:text-sm">
                  {lastCards.map((card, i) => {
                    return (
                      <div
                        key={i}
                        className="flex w-full gap-1 sm:gap-2 lg:gap-5"
                      >
                        <span>Last {4 - i}★: </span>
                        <span>{card}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
