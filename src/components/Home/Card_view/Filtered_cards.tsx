import { useState, useEffect } from "react";
import EnCards from "../../../assets/json/en_cards.json";
import JpCards from "../../../assets/json/jp_cards.json";
import type {
  CardState,
  SelectedFilterTypesProps,
  CardsTypes,
} from "../../Global/Types";
import CardModal from "../../Shared/Card_modal";
import { useTheme } from "../../../context/Theme_toggle";

import { useServer } from "../../../context/Server";

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

  const [cardState, setCardState] = useState<CardState>({
    cardId: 0,
    rarity: 4,
    name: "",
    cardName: "",
    cardAttribute: "",
    sekaiId: 0,
  });

  const { server } = useServer();
  // const formatCardName = (id: number) => String(id).padStart(4, "0");
  const today = Date.now();

  const handleCardClick = (card: CardsTypes) => {
    if (card.sekai_id) {
      setCardState({
        cardId: card.id,
        rarity: card.rarity,
        name: card.character,
        cardName: card.name,
        cardAttribute: card.attribute,
        sekaiId: card.sekai_id,
      });
    }
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsLoading(true);
    setIsLoading2(true);
    setIsOpen(false);
  };

  const cardsData: CardsTypes[] = server === "global" ? EnCards : JpCards;

  const filteredCards = cardsData.filter((card) => {
    if (today < card.released) {
      return;
    }
    const hasCharacterFilter = selectedFilters.Character.length > 0;
    const hasUnitFilter = selectedFilters.Unit.length > 0;
    const matchesCharacter = selectedFilters.Character.includes(card.character);
    const matchesUnit = selectedFilters.Unit.includes(card.unit);
    const matchesAttribute =
      selectedFilters.Attribute.length === 0 ||
      selectedFilters.Attribute.includes(card.attribute);
    const matchesRarity =
      selectedFilters.Rarity.length === 0 ||
      selectedFilters.Rarity.includes(card.rarity);

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

    return matchesCharacterOrUnit && matchesAttribute && matchesRarity;
  });

  const sortedCards = [...filteredCards].sort((a, b) => {
    return sortOrder === "desc"
      ? b.released - a.released
      : a.real_id - b.real_id;
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilters, server]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentCards = sortedCards.slice(startIndex, endIndex);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        className={`p-8 text-center ${
          theme === "light" ? "text-gray-600" : "text-gray-400"
        }`}
      >
        No cards match the selected filters.
      </div>
    );
  }

  return (
    <div
      className={`${
        theme == "dark" ? "bg-bg-dark-mode" : "bg-bg-light-mode"
      } flex flex-col items-center justify-center gap-5 w-full pb-10`}
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
          Showing {startIndex + 1}-{Math.min(endIndex, filteredCards.length)} of{" "}
          {filteredCards.length} cards
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
                className="size-6"
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
                className="size-6"
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
          {currentCards.map((card) => {
            return (
              // CARD CONTAINER
              <div
                key={card.id}
                className={`flex flex-col items-center justify-center p-3 rounded-lg duration-200  ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-white hover:bg-gray-50 shadow-sm hover:shadow-md"
                }`}
              >
                {/* CARD THUMBNAIL */}
                <button
                  onClick={() => handleCardClick(card)}
                  className="text-white rounded  hover:opacity-80 transition-opacity mb-2 e"
                >
                  {(card.rarity == 4 || card.rarity == 3) && (
                    <div className="relative">
                      <img
                        src={`/images/card_thumbnails/${card.id}_t.webp`}
                        className={`h-auto w-full -2 max-w-[300px] ml-auto mr-auto rounded 
                      
                          `}
                        alt={card.name}
                      />
                      <div className="absolute top-0 right-1">
                        {Array(card.rarity)
                          .fill(0)
                          .map((_, i) => (
                            <img
                              key={i}
                              src="/images/rarity_icons/trained_star.png"
                              style={{ width: "15px", display: "inline-block" }}
                            />
                          ))}
                      </div>
                    </div>
                  )}
                  {card.rarity == 5 && (
                    <div className="relative">
                      <img
                        src={`/images/card_thumbnails/${card.id}_bd.webp`}
                        className="h-auto w-full max-w-[300px]  rounded"
                        alt={card.name}
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
                      <img
                        src={`/images/card_thumbnails/${card.id}.webp`}
                        className="h-auto w-full max-w-[300px]  rounded"
                        alt={card.name}
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
                {/* CARD NAME */}
                <div
                  className={`text-center text-xs flex flex-col justify-center items-center sm:text-sm md:text-base font-medium line-clamp-2 h-20 gap-2 ${
                    theme === "light" ? "text-gray-800" : "text-gray-200"
                  }`}
                >
                  <div className="flex flex-row gap-2 justify-center items-center">
                    <img
                      src={`/images/attribute_icons/${card.attribute}.webp`}
                      style={{
                        width: "1.5rem",
                      }}
                    />
                    {card.name}
                  </div>
                  <div>{card.character}</div>
                  <div className="text-[10px]">
                    (
                    {(card.card_type === "event" || card.card_type === "") && (
                      <span>Permanent</span>
                    )}
                    {card.card_type === "limited" && <span>Limited</span>}
                    {card.card_type === "bday" && <span>Birthday</span>}
                    {card.card_type === "bloom_fes" && <span>Bloom Fes</span>}
                    {card.card_type === "color_fes" && <span>Color Fes</span>}
                    {card.card_type === "movie_exclusive" && (
                      <span>Movie Exclusive</span>
                    )}
                    {card.card_type === "limited_collab" && (
                      <span>Limited Collab</span>
                    )}
                    {card.card_type === "unit_limited" && (
                      <span>Unit Limited</span>
                    )}
                    )
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
