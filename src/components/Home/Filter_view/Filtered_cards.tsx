import { useState, useEffect, useRef } from "react";
import AllCards from "../../../assets/json/cards.json";
import type {
  CardState,
  SelectedFilterTypesProps,
  AllCardTypes,
} from "../../Global/Types";
import CardModal from "../../Modal/Card_modal";
import { useTheme } from "../../../context/Theme_toggle";
import { useServer } from "../../../context/Server";
import CardGrid from "./Card_grid";

const cardTypeMapping = {
  permanent: "Permanent",
  limited: "Limited",
  movie_exclusive: "Movie",
  unit_limited: "Unit Limited",
  color_fes: "ColorFes",
  bloom_fes: "BloomFes",
  limited_collab: "Collab",
};

export default function FilteredCards({
  selectedFilters,
}: SelectedFilterTypesProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [cardsPerPage] = useState(20);
  const [shouldScrollToTop, setShouldScrollToTop] = useState(false);

  const filteredCardsRef = useRef<HTMLDivElement>(null);

  const [cardState, setCardState] = useState<CardState>({
    cardId: 0,
    rarity: 4,
    name: "",
    cardName: "",
    cardAttribute: "",
    sekaiId: 0,
    cardType: "",
  });

  const { server } = useServer();

  const today = Date.now();

  const handleCardClick = (card: AllCardTypes) => {
    setCardState({
      cardId: card.id,
      rarity: card.rarity,
      name: card.character,
      cardName:
        server === "global" || server === "saved" ? card.name : card.jp_name,
      cardAttribute: card.attribute,
      sekaiId: card.id,
      cardType: card.card_type,
    });

    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsLoading(true);
    setIsLoading2(true);
    setIsOpen(false);
  };

  const filteredCards = AllCards.filter((card) => {
    // Filter out skipped en cards (rui2) or unpredictable release date (collab cards)

    if (server === "global" || server === "saved") {
      if (today < card.en_released || card.en_released <= 0) {
        return false;
      }
    } else {
      if (today < card.jp_released) {
        return false;
      }
    }

    const hasCharacterFilter = selectedFilters.Character.length > 0;
    const hasUnitFilter = selectedFilters.Unit.length > 0;
    const hasSubUnitFilter = selectedFilters.sub_unit.length > 0;
    const matchesCharacter = selectedFilters.Character.includes(card.character);
    const matchesUnit = selectedFilters.Unit.includes(card.unit);
    const matchesSubUnit =
      (card.sub_unit && selectedFilters.sub_unit.includes(card.sub_unit)) ||
      !card.sub_unit;
    const matchesAttribute =
      selectedFilters.Attribute.length === 0 ||
      selectedFilters.Attribute.includes(card.attribute);
    const matchesRarity =
      selectedFilters.Rarity.length === 0 ||
      selectedFilters.Rarity.includes(card.rarity);
    const hasCardTypeFilter = selectedFilters.Type.length > 0;
    const cardTypeKey = card.card_type as keyof typeof cardTypeMapping;
    const matchesCardType = selectedFilters.Type.includes(
      cardTypeMapping[cardTypeKey] 
    );

    let matchesCharacterOrUnit = false;
    if (!hasCharacterFilter && !hasUnitFilter) {
      matchesCharacterOrUnit = true;
    } else if (hasCharacterFilter && hasUnitFilter) {
      matchesCharacterOrUnit = matchesCharacter || matchesUnit;
    } else if (hasCharacterFilter) {
      matchesCharacterOrUnit = matchesCharacter;
    } else if (hasUnitFilter) {
      matchesCharacterOrUnit = matchesUnit;
    }

    let subUnitMatch = true;
    if (hasSubUnitFilter) {
      subUnitMatch = matchesSubUnit;
    }

    let cardTypeMatch = true;
    if (hasCardTypeFilter) {
      cardTypeMatch = matchesCardType;
    }

    const searchTerm = selectedFilters.search.toLowerCase().trim();
    const nameToSearch =
      server === "global" || server === "saved" ? card.name : card.jp_name;
    const nameMatch = nameToSearch?.toLowerCase().includes(searchTerm) || false;

    return (
      matchesCharacterOrUnit &&
      matchesAttribute &&
      matchesRarity &&
      nameMatch &&
      subUnitMatch &&
      cardTypeMatch
    );
  });

  const sortedCards = [...filteredCards].sort((a, b) => {
    const isGlobalServer = server === "global" || server === "saved";
    const isMovieFilter =
      selectedFilters.Type.length === 1 && selectedFilters.Type[0] === "Movie";

    if (sortOrder === "desc") {
      if (isGlobalServer && !isMovieFilter) {
        return b.en_released - a.en_released;
      } else {
        return b.id - a.id;
      }
    } else {
      // ascending order
      if (isGlobalServer && !isMovieFilter) {
        return a.en_released - b.en_released;
      } else {
        return a.id - b.id;
      }
    }
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilters, server, sortOrder]);

  // clculate pagination
  const totalPages = Math.ceil(sortedCards.length / cardsPerPage); // Use sortedCards, not filteredCards

  // Ensure currentPage doesn't exceed totalPages
  const safePage = Math.min(currentPage, totalPages || 1);
  const startIndex = (safePage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentCards = sortedCards.slice(startIndex, endIndex);

  // Update currentPage if it exceeds totalPages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  //  scroll after content load
  useEffect(() => {
    if (shouldScrollToTop) {
      //ensure DOM is updated
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (filteredCardsRef.current) {
            filteredCardsRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          } else {
            // Fallback
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }
          setShouldScrollToTop(false);
        }, 100); // Small delay to ensure cards finished rendering
      });
    }
  }, [currentPage, currentCards, shouldScrollToTop]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setShouldScrollToTop(true);
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (filteredCards.length === 0) {
    return (
      <div
        className={`p-8 h-[75vh] text-center ${
          theme === "light"
            ? "text-gray-600 bg-[#f9fafb]"
            : "text-gray-400 bg-[#101828]"
        }`}
      >
        No cards match the selected filters.
      </div>
    );
  }

  return (
    <div
      className={`${
        theme == "dark" ? "bg-[#101828]" : "bg-[#f9fafb]"
      } flex flex-col items-center justify-center gap-2 w-full `}
      ref={filteredCardsRef}
    >
      <div className="flex  text-center flex-row w-full justify-center items-center pl-1 pr-1">
        {/* CARD TYPES */}
      </div>
      <div className="flex flex-row justify-center items-center">
        {" "}
        <div
          className={`text-center text-sm md:text-base px-2  ${
            theme === "light" ? "text-gray-600" : "text-gray-400"
          }`}
        >
          Showing {startIndex + 1}-{Math.min(endIndex, sortedCards.length)} of{" "}
          {sortedCards.length} cards
        </div>
        <div>
          <button onClick={toggleSortOrder}>
            {sortOrder === "desc" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`size-6 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`size-6 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* CARDS GRID*/}
      <div className="w-max[500px] h-max-[300px] px-2 sm:px-5  ">
        <div className="grid xs grid-cols-2 gap-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  sm:gap-4 md:gap-6">
          {currentCards.map((card, index) => {
            return (
              // CARD CONTAINER
              <div
                key={`${card.id}-${sortOrder}-${currentPage}-${index}`}
                className={`flex flex-col items-center justify-center p-3 rounded-lg duration-200  ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-white hover:bg-gray-50 shadow-sm hover:shadow-md"
                }`}
              >
                {/* CARD THUMBNAIL */}
                <button
                  onClick={() => handleCardClick(card)}
                  className="text-white rounded  hover:opacity-80 transition-opacity mb-2 w-full"
                >
                  {(card.rarity == 4 || card.rarity == 3) && (
                    <div className="relative">
                      <CardGrid
                        mode="t"
                        cardId={card.id}
                        cardName={card.name}
                      />
                      <div className="absolute top-0 right-1">
                        {Array(card.rarity)
                          .fill(0)
                          .map((_, i) => (
                            <img
                              key={i}
                              src={`images/rarity_icons/${
                                card.id === 1167 ? "un" : ""
                              }trained_star.png`}
                              style={{ width: "15px", display: "inline-block" }}
                            />
                          ))}
                      </div>
                    </div>
                  )}
                  {/* MIKU TOUHOU CARD THAT DOESNT HAVE TRAINED CARD FOR SOME REASON */}

                  {card.rarity == 5 && (
                    <div className="relative">
                      <CardGrid
                        mode="bd"
                        cardId={card.id}
                        cardName={card.name}
                      />

                      <img
                        src="/images/rarity_icons/bday.png"
                        style={{
                          position: "absolute",
                          bottom: 5,
                          left: 5,
                          width: "1.5rem",
                        }}
                      />
                    </div>
                  )}
                  {card.rarity <= 2 && (
                    <div className="relative">
                      <CardGrid
                        mode="u"
                        cardId={card.id}
                        cardName={card.name}
                      />
                      <div className="absolute top-0 left-1">
                        {Array(card.rarity)
                          .fill(0)
                          .map((_, i) => {
                            return (
                              <img
                                key={i}
                                src="/images/rarity_icons/untrained_star.png"
                                style={{
                                  width: "15px",
                                  display: "inline-block",
                                }}
                              />
                            );
                          })}
                      </div>
                    </div>
                  )}
                </button>
                {/* CARD DETAILS*/}

                <div
                  className={`text-center flex flex-col justify-center items-center gap-1 px-1 h-20 ${
                    theme === "light" ? "text-gray-700" : "text-gray-200"
                  }`}
                >
                  {/* CARD NAME */}
                  <h3 className="font-medium text-sm sm:text-base line-clamp-2 leading-tight">
                    {server === "global" ? card.name : card.jp_name}
                  </h3>

                  {/* CHARACTER + ATTRIBUTE*/}
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {card.character}
                    </p>
                    <img
                      src={`/images/attribute_icons/${card.attribute}.webp`}
                      className="w-4 h-4 object-contain opacity-90"
                      alt={card.attribute}
                      title={card.attribute.toUpperCase()}
                    />
                  </div>

                  {/* CARD TYPE */}
                  <div className="text-[10px] mt-0.5">
                    <span
                      className={`
      px-1.5 py-0.5 rounded-full ${
        theme === "light"
          ? "bg-gray-100 text-gray-600"
          : "bg-gray-700 text-gray-300"
      }
    `}
                    >
                      {(() => {
                        switch (card.card_type) {
                          case "limited":
                            return "LIMITED";
                          case "bday":
                            return "BD";
                          case "bloom_fes":
                            return "BLOOM";
                          case "color_fes":
                            return "COLOR";
                          case "movie_exclusive":
                            return "MOVIE";
                          case "limited_collab":
                            return "COLLAB";
                          case "unit_limited":
                            return "UNIT";
                          default:
                            return "PERM";
                        }
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-5 mb-4 px-4">
          <div
            className={`text-sm mb-2 sm:hidden ${
              theme === "light" ? "text-gray-600" : "text-gray-400"
            }`}
          >
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* PREVIOUS BUTTON */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-2 py-2 sm:px-3 text-sm rounded ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-opacity-80 active:scale-95"
              } ${
                theme === "dark"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">‹</span>
            </button>

            {/* PAGE NUMBERS - HIDDEN IN MOBILE*/}
            <div className="flex items-center gap-1">
              {generatePageNumbers().map((page, index) => {
                // ON MOBILE - ONLY SHOW CURRENT PAGE
                const isMobile = window.innerWidth < 640;
                const shouldShowOnMobile =
                  !isMobile ||
                  page === currentPage ||
                  page === currentPage - 1 ||
                  page === currentPage + 1 ||
                  page === 1 ||
                  page === totalPages ||
                  page === "...";

                if (isMobile && !shouldShowOnMobile) return null;

                return (
                  <button
                    key={index}
                    onClick={() =>
                      typeof page === "number" && handlePageChange(page)
                    }
                    disabled={page === "..."}
                    className={`px-2 py-2 sm:px-3 text-sm rounded min-w-[32px] sm:min-w-[36px] ${
                      page === currentPage
                        ? theme === "dark"
                          ? "bg-blue-600 text-white"
                          : "bg-blue-500 text-white"
                        : page === "..."
                        ? "cursor-default"
                        : theme === "dark"
                        ? "bg-gray-700 text-white hover:bg-gray-600 active:scale-95"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300 active:scale-95"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            {/* NEXT BUTTOn*/}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-2 py-2 sm:px-3 text-sm rounded ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-opacity-80 active:scale-95"
              } ${
                theme === "dark"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">›</span>
            </button>
          </div>
        </div>
      )}

      <CardModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        {...cardState}
        isLoading={isLoading}
        isLoading2={isLoading2}
        setIsLoading={setIsLoading}
        setIsLoading2={setIsLoading2}
      />
    </div>
  );
}
