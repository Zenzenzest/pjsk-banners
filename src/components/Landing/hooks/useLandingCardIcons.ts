import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { imgHost } from "../../../constants/common";
import { useProsekaData } from "../../../context/Data";
import type { AllCardTypes } from "../../../types/common";

type UseLandingCardsProps = {
  selectedBannerId: number;
  n: string;
};

export const useLandingCardIcons = ({
  selectedBannerId,
  n,
}: UseLandingCardsProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 });
  const [visibleCardIndices, setVisibleCardIndices] = useState<number[]>([]);

  const { allCards, jpBanners, enBanners, jpEvents } = useProsekaData();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationFrameRef = useRef<number>(0);

  const banners = useMemo(
    () => (n === "jp" ? jpBanners : enBanners),
    [n, jpBanners, enBanners]
  );

  const bannerData = useMemo(
    () => banners.find((banner) => banner.id === selectedBannerId),
    [banners, selectedBannerId]
  );

  const bannerCardsData = useMemo(
    () => allCards.filter((card) => bannerData?.cards.includes(card.id)),
    [allCards, bannerData]
  );

  const eventId = bannerData?.event_id;
  const eventData = useMemo(
    () => jpEvents.find((ev) => ev.id === eventId),
    [jpEvents, eventId]
  );

  const eventCardsData = useMemo(
    () => allCards.filter((card) => eventData?.cards.includes(card.id)),
    [allCards, eventData]
  );

  const cardsData = useMemo(
    () => (eventId != null ? eventCardsData : bannerCardsData),
    [eventId, eventCardsData, bannerCardsData]
  );

  const shouldUseCarousel = cardsData.length > 6;

  // Memoized image path getter
  const getImagePath = useCallback((card: AllCardTypes) => {
    const imgPath =
      card.rarity === 5
        ? "_bd.webp"
        : card.rarity === 4 || card.rarity === 3
        ? "_t.webp"
        : ".webp";
    return `${imgHost}/icons/${card.id}${imgPath}`;
  }, []);

  // Calculate visible card indices based on scroll position
  const calculateVisibleIndices = useCallback(() => {
    if (!containerRef.current) return [];

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const visibleIndices: number[] = [];

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
        visibleIndices.push(index);
      }
    });

    return visibleIndices;
  }, []);

  // Navigation helpers
  const scrollToIndex = useCallback((index: number) => {
    if (!containerRef.current || !cardRefs.current[index]) return;

    const cardElement = cardRefs.current[index];
    if (cardElement) {
      containerRef.current.scrollTo({
        left: cardElement.offsetLeft,
        behavior: "smooth",
      });
    }
  }, []);

  const scrollToNext = useCallback(() => {
    if (!containerRef.current) return;

    const currentScroll = containerRef.current.scrollLeft;
    const containerWidth = containerRef.current.clientWidth;
    // Scroll 80% of container width
    const newScroll = currentScroll + containerWidth * 0.8;

    containerRef.current.scrollTo({
      left: newScroll,
      behavior: "smooth",
    });
  }, []);

  const scrollToPrev = useCallback(() => {
    if (!containerRef.current) return;

    const currentScroll = containerRef.current.scrollLeft;
    const containerWidth = containerRef.current.clientWidth;
    const newScroll = Math.max(0, currentScroll - containerWidth * 0.8);

    containerRef.current.scrollTo({
      left: newScroll,
      behavior: "smooth",
    });
  }, []);

  // Drag handlers
  const handleDragStart = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setDragStart({
      x: clientX,
      scrollLeft: containerRef.current.scrollLeft,
    });
    containerRef.current.style.scrollBehavior = "auto";
  }, []);

  const handleDragMove = useCallback(
    (clientX: number) => {
      if (!isDragging || !containerRef.current) return;

      const deltaX = clientX - dragStart.x;
      const newScrollLeft = dragStart.scrollLeft - deltaX;
      containerRef.current.scrollLeft = newScrollLeft;
    },
    [isDragging, dragStart]
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging || !containerRef.current) return;
    setIsDragging(false);
    containerRef.current.style.scrollBehavior = "smooth";
  }, [isDragging]);

  // Event handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!shouldUseCarousel) return;
      e.preventDefault();
      handleDragStart(e.clientX);
    },
    [shouldUseCarousel, handleDragStart]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!shouldUseCarousel) return;
      e.preventDefault();
      handleDragMove(e.clientX);
    },
    [shouldUseCarousel, handleDragMove]
  );

  const handleMouseUp = useCallback(() => {
    if (!shouldUseCarousel) return;
    handleDragEnd();
  }, [shouldUseCarousel, handleDragEnd]);

  const handleMouseLeave = useCallback(() => {
    if (!shouldUseCarousel) return;
    setIsHovering(false);
    handleDragEnd();
  }, [shouldUseCarousel, handleDragEnd]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!shouldUseCarousel) return;
      handleDragStart(e.touches[0].clientX);
    },
    [shouldUseCarousel, handleDragStart]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!shouldUseCarousel) return;
      e.preventDefault();
      handleDragMove(e.touches[0].clientX);
    },
    [shouldUseCarousel, handleDragMove]
  );

  const handleTouchEnd = useCallback(() => {
    if (!shouldUseCarousel) return;
    handleDragEnd();
  }, [shouldUseCarousel, handleDragEnd]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!shouldUseCarousel || !containerRef.current || !isHovering) return;

      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        const scrollMultiplier = 2;
        const scrollAmount = e.deltaY * scrollMultiplier;

        const originalScrollBehavior =
          containerRef.current.style.scrollBehavior;
        containerRef.current.style.scrollBehavior = "auto";
        containerRef.current.scrollLeft += scrollAmount;

        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.style.scrollBehavior = originalScrollBehavior;
          }
        }, 50);
      }
    },
    [shouldUseCarousel, isHovering]
  );

  // Scroll position update
  const updateScrollPosition = useCallback(() => {
    if (!containerRef.current || !shouldUseCarousel) return;

    const scrollLeft = containerRef.current.scrollLeft;
    const scrollWidth = containerRef.current.scrollWidth;
    const clientWidth = containerRef.current.clientWidth;

    setIsAtStart(scrollLeft <= 10);
    setIsAtEnd(scrollLeft >= scrollWidth - clientWidth - 10);

    // Update visible card indices
    const newVisibleIndices = calculateVisibleIndices();
    setVisibleCardIndices(newVisibleIndices);
  }, [shouldUseCarousel, calculateVisibleIndices]);

  // Effect for all event listeners and initial setup
  useEffect(() => {
    if (!shouldUseCarousel) {
      setIsAtStart(true);
      setIsAtEnd(false);
      setVisibleCardIndices([]);
      return;
    }

    // if (containerRef.current) {
    //   containerRef.current.scrollLeft = 0;
    // }

    setIsAtStart(true);
    setIsAtEnd(cardsData.length <= 6);

    // Set initial visible indices
    const initialVisibleCount = Math.min(6, cardsData.length);
    const initialIndices = Array.from(
      { length: initialVisibleCount },
      (_, i) => i
    );
    setVisibleCardIndices(initialIndices);

    const container = containerRef.current;
    if (!container) return;

    // Scroll event handlers
    const handleScroll = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        updateScrollPosition();
      });
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    container.addEventListener("scrollend", handleScroll, { passive: true });
    container.addEventListener("wheel", handleWheel, { passive: false });

    // Initial scroll position update
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("scrollend", handleScroll);
      container.removeEventListener("wheel", handleWheel);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    shouldUseCarousel,
    cardsData.length,
    selectedBannerId,
    n,
    handleWheel,
    updateScrollPosition,
  ]);

  // Effect for drag events
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => handleDragMove(e.clientX);
    const handleGlobalMouseUp = () => handleDragEnd();

    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  return {
    // State
    isHovering,
    setIsHovering,
    isAtStart,
    isAtEnd,
    isDragging,
    cardsData,
    shouldUseCarousel,
    visibleCardIndices,

    // Refs
    containerRef,
    cardRefs,

    // Functions
    getImagePath,
    scrollToNext,
    scrollToPrev,
    scrollToIndex,

    // Event handlers
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};
