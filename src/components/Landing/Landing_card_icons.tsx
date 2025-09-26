import { useLandingCardIcons } from "./hooks/useLandingCardIcons";

type LandingCardsProps = {
  selectedBannerId: number;
  n: number;
};

export default function LandingCardIcons({
  selectedBannerId,
  n,
}: LandingCardsProps) {
  const {
    setIsHovering,
    isAtStart,
    isAtEnd,
    isDragging,
    cardsData,
    shouldUseCarousel,
    visibleCardIndices,
    containerRef,
    cardRefs,
    getImagePath,
    scrollToNext,
    scrollToPrev,
    scrollToIndex,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useLandingCardIcons({
    selectedBannerId,
    n,
  });

  //  DEFAULT
  if (!shouldUseCarousel) {
    return (
      <div className="flex flex-row justify-between items-center gap-1 max-w-[454px] p-1 mx-auto sm:min-h-[117px] min-h-[90px]">
        {cardsData.map((card, i) => {
          if (i >= 6) return null;

          return (
            <img
              key={`${card.id}-${selectedBannerId}-${n}-${i}`}
              src={getImagePath(card)}
              alt={`${card.id}-${card.character}`}
              className={`${
                cardsData.length <= 3 ? "max-w-[75px]" : "w-full"
              } rounded-lg`}
            />
          );
        })}
      </div>
    );
  }

  // SCROLL
  return (
    <div
      className="relative w-full mx-auto"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* FADE GRADIENTS */}
      {shouldUseCarousel && !isAtStart && (
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r  z-10 pointer-events-none" />
      )}
      {shouldUseCarousel && !isAtEnd && (
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l   z-10 pointer-events-none" />
      )}

      {/* BUTTONS*/}
      {shouldUseCarousel && !isAtStart && (
        <button
          onClick={scrollToPrev}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-30  bg-black/30 hover:bg-black/50 border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Previous cards"
        >
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {shouldUseCarousel && !isAtEnd && (
        <button
          onClick={scrollToNext}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-30  bg-black/30 hover:bg-black/50 border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Next cards"
        >
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}
      <div
        ref={containerRef}
        className={`relative flex flex-row items-center gap-1 max-w-[450px] p-1 mx-auto sm:min-h-[117px] min-h-[90px] overflow-x-auto scrollbar-hide ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{
          scrollSnapType: isDragging ? "none" : "x mandatory",
          scrollBehavior: "smooth",
          userSelect: "none",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex flex-row gap-1 min-w-max">
          {cardsData.map((card, i) => {
            const isVisible = visibleCardIndices.includes(i);

            return (
              <div
                key={`${card.id}-${selectedBannerId}-${n}-${i}`}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="flex-shrink-0 flex justify-center w-[calc(100vw/6)] max-w-[75px]"
                style={{
                  scrollSnapAlign: "start",
                  opacity: isVisible ? 1 : 0.4,
                  transform: isVisible ? "scale(1)" : "scale(0.85)",
                  transition:
                    "opacity 200ms ease-out, transform 200ms ease-out",
                }}
              >
                <img
                  src={getImagePath(card)}
                  alt={`${card.id}-${card.character}`}
                  className="object-contain max-w-full max-h-full rounded-lg w-full"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* DOTS INDICATOR */}
      {shouldUseCarousel && (
        <div className="flex justify-center mt-1 gap-1">
          {Array.from({ length: Math.ceil(cardsData.length / 3) }, (_, i) => {
            const isActive = visibleCardIndices.some(
              (idx) => Math.floor(idx / 3) === i
            );
            return (
              <button
                key={i}
                onClick={() => scrollToIndex(i * 3)}
                className={`w-1 h-1 rounded-full transition-colors ${
                  isActive ? "bg-[#72bcf2]" : "bg-gray-300"
                }`}
                aria-label={`Go to card group ${i + 1}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
