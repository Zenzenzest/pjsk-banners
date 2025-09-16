import { useState, useEffect, useRef } from "react";

import type {
  CardState,
  SelectedCardFilterTypesProps,
} from "../FilterTabTypes";
import type { AllCardTypes } from "../../../types/common";
import CardModal from "../../Modal/Card/Card_modal";
import { useTheme } from "../../../context/Theme_toggle";
import { useServer } from "../../../context/Server";
import { cardTypeMapping } from "../Filter_constants";

import Pagination from "../Ui/Pagination";
import CardThumbnail from "./Card_thumbnail";
import { useProsekaData } from "../../../context/Data";

export default function FilteredCards({
  selectedCardFilters,
}: SelectedCardFilterTypesProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [cardsPerPage] = useState(20);
  const [shouldScrollToTop, setShouldScrollToTop] = useState(false);

  const { allCards } = useProsekaData();

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

  const filteredCards = allCards.filter((card) => {
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

    const hasCharacterFilter = selectedCardFilters.Character.length > 0;
    const hasUnitFilter = selectedCardFilters.Unit.length > 0;
    const hasSubUnitFilter = selectedCardFilters.sub_unit.length > 0;
    const matchesCharacter = selectedCardFilters.Character.includes(
      card.character
    );
    const matchesUnit = selectedCardFilters.Unit.includes(card.unit);
    const matchesSubUnit =
      (card.sub_unit && selectedCardFilters.sub_unit.includes(card.sub_unit)) ||
      !card.sub_unit;
    const matchesAttribute =
      selectedCardFilters.Attribute.length === 0 ||
      selectedCardFilters.Attribute.includes(card.attribute);
    const matchesRarity =
      selectedCardFilters.Rarity.length === 0 ||
      selectedCardFilters.Rarity.includes(card.rarity);
    const hasCardTypeFilter = selectedCardFilters.Type.length > 0;
    const cardTypeKey = card.card_type as keyof typeof cardTypeMapping;
    const matchesCardType = selectedCardFilters.Type.includes(
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

    const searchTerm = selectedCardFilters.search.toLowerCase().trim();
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
      selectedCardFilters.Type.length === 1 &&
      selectedCardFilters.Type[0] === "Movie";

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
  }, [selectedCardFilters, server, sortOrder]);

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
    if (currentPage === page) {
      return;
    }
    setCurrentPage(page);
    setShouldScrollToTop(true);
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
        {/* SORT TOGGLE BUTTON */}
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
              <div
                key={`${card.id}-${sortOrder}-${currentPage}-${index}`}
                className={`flex flex-col items-center justify-center p-3 rounded-lg duration-200 cursor-pointer  ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-white hover:bg-gray-50 shadow-sm hover:shadow-md"
                }`}
                onClick={() => handleCardClick(card)}
              >
                {/* CARD THUMBNAIL */}
                <button className="text-white rounded  hover:opacity-80 transition-opacity mb-2 w-full">
                  <CardThumbnail card={card} />
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
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
