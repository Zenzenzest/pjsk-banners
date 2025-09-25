import { imgHost } from "../../constants/common";
import { useProsekaData } from "../../context/Data";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { preload } from 'react-dom';
import type { AllCardTypes } from "../../types/common";

type LandingCardsProps = {
  selectedBannerId: number;
  n: number;
};

export default function LandingCards({
  selectedBannerId,
  n,
}: LandingCardsProps) {
  const { allCards, jpBanners, enBanners, jpEvents } = useProsekaData();
  const banners = n === 0 ? jpBanners : enBanners;
  
  // Use useMemo to recalculate when dependencies change
  const bannerData = useMemo(() => 
    banners.find((banner) => banner.id === selectedBannerId),
    [banners, selectedBannerId]
  );

  const bannerCardsData = useMemo(() => 
    allCards.filter((card) => bannerData?.cards.includes(card.id)),
    [allCards, bannerData]
  );

  const eventId = bannerData?.event_id;
  const eventData = useMemo(() => 
    jpEvents.find((ev) => ev.id === eventId),
    [jpEvents, eventId]
  );

  const eventCardsData = useMemo(() => 
    allCards.filter((card) => eventData?.cards.includes(card.id)),
    [allCards, eventData]
  );

  const cardsData = useMemo(() => 
    eventId != undefined ? eventCardsData : bannerCardsData,
    [eventId, eventCardsData, bannerCardsData]
  );

  // Helper function to get image path
  const getImagePath = useCallback((card: AllCardTypes) => {
    const imgPath =
      card.rarity === 5
        ? "_bd.webp"
        : card.rarity === 4 || card.rarity === 3
        ? "_t.webp"
        : ".webp";
    return `${imgHost}/icons/${card.id}${imgPath}`;
  }, []);

  // Preload images when cardsData changes
  useEffect(() => {
    if (cardsData.length === 0) return;

    // Preload all card images
    cardsData.forEach((card) => {
      const imageUrl = getImagePath(card);
      preload(imageUrl, { as: 'image' });
    });
  }, [cardsData, getImagePath]);

  // Reset carousel state when cardsData changes
  const [visibleCardIndices, setVisibleCardIndices] = useState<number[]>([]);
  const shouldUseCarousel = cardsData.length > 6;
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Reset carousel when cards change
  useEffect(() => {
    if (!shouldUseCarousel) {
      setVisibleCardIndices([]);
      return;
    }
    
    // Reset to show first few cards
    const initialVisibleCount = Math.min(6, cardsData.length);
    setVisibleCardIndices(Array.from({ length: initialVisibleCount }, (_, i) => i));
    
    // Reset scroll position
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0;
    }
  }, [cardsData, shouldUseCarousel, selectedBannerId, n]); 
  

  const updateVisibleCards = useCallback(() => {
    if (!containerRef.current || !shouldUseCarousel) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const newVisibleIndices: number[] = [];

    cardRefs.current.forEach((cardEl, index) => {
      if (!cardEl) return;

      const cardRect = cardEl.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const containerLeft = containerRect.left;
      const containerRight = containerRect.right;

      const tolerance = cardRect.width * 0.3;
      if (
        cardCenter >= containerLeft - tolerance &&
        cardCenter <= containerRight + tolerance
      ) {
        newVisibleIndices.push(index);
      }
    });

    setVisibleCardIndices(newVisibleIndices);
  }, [shouldUseCarousel]);

  // Scroll effect 
  useEffect(() => {
    if (!shouldUseCarousel) return;

    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      updateVisibleCards();
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    container.addEventListener("scrollend", handleScroll, { passive: true });

    // Initial update
    const timeoutId = setTimeout(updateVisibleCards, 50);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("scrollend", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [shouldUseCarousel, updateVisibleCards, cardsData]); 

  // DEFAULT 
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
    <div className="relative w-full mx-auto">
      <div
        ref={containerRef}
        className="relative flex flex-row items-center gap-1 max-w-[450px] p-1 mx-auto sm:min-h-[117px] min-h-[90px] overflow-x-auto scrollbar-hide"
        style={{
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
        }}
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
                  transition: "opacity 200ms ease-out, transform 200ms ease-out",
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
    </div>
  );
}