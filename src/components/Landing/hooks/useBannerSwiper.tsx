// useCarousel.ts - Update the hook
import { useState, useEffect, useCallback } from "react";
import type { BannerTypes } from "../../../types/common";

interface UseCarouselProps {
  latestBanners: BannerTypes[];
  maxThumbnails?: number;
  currentIndex?: number;
}

export const useBannerSwiper = ({
  latestBanners,
  maxThumbnails = 4,
}: UseCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [thumbnailPageIndex, setThumbnailPageIndex] = useState(0);
  const [sekaiId, setSekaiId] = useState(0)
  const [gachaId, setGachaId] = useState(9)
  const [isGachaOpen, setIsGachaOpen] = useState(false)


// Modal Handlers
  const handleGachaClick = (
    sekai_id: number | undefined,
    gacha_id: number | undefined
  ) => {
    if (gacha_id) {
      setGachaId(gacha_id);
    }
    if (sekai_id) {
      setSekaiId(sekai_id);
    }
    setIsGachaOpen(true);
  };

const handleCloseModal = () => {
    setIsGachaOpen(false);
  };





  // Calculate thumbnail pages
  const thumbnailPages = Math.ceil(latestBanners.length / maxThumbnails);

  // Keep thumbnail page in sync with current index
  useEffect(() => {
    const newThumbnailPage = Math.floor(currentIndex / maxThumbnails);
    setThumbnailPageIndex(newThumbnailPage);
  }, [currentIndex, maxThumbnails]);

  const goToSlide = useCallback((index: number) => {
    setIsSliding(true);
    setCurrentIndex(index);
  }, []);

  const goToPrev = () => {
    const newIndex =
      currentIndex === 0 ? latestBanners.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex =
      currentIndex === latestBanners.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  };

  const handleThumbnailClick = (index: number) => {
    if (index !== currentIndex) {
      goToSlide(index);
    }
  };

  const nextThumbnailPage = () => {
    setThumbnailPageIndex((prev) =>
      prev < thumbnailPages - 1 ? prev + 1 : prev
    );
  };

  const prevThumbnailPage = () => {
    setThumbnailPageIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  // Get visible thumbnails for current page
  const getVisibleThumbnails = () => {
    return latestBanners.slice(
      thumbnailPageIndex * maxThumbnails,
      (thumbnailPageIndex + 1) * maxThumbnails
    );
  };

  // Get global index for thumbnail
  const getGlobalIndex = (localIndex: number) => {
    return thumbnailPageIndex * maxThumbnails + localIndex;
  };

  // Reset sliding state after animation
  useEffect(() => {
    if (isSliding) {
      const timer = setTimeout(() => setIsSliding(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isSliding]);

  return {
    // state
    currentIndex,
    isSliding,
    thumbnailPageIndex,
    thumbnailPages,
    sekaiId,
    gachaId,
    isGachaOpen,

    // actions
    goToSlide,
    goToPrev,
    goToNext,
    handleThumbnailClick,
    nextThumbnailPage,
    prevThumbnailPage,
    handleGachaClick,
    handleCloseModal,

    // helpers
    getVisibleThumbnails,
    getGlobalIndex,
    canGoToNextThumbnailPage: thumbnailPageIndex < thumbnailPages - 1,
    canGoToPrevThumbnailPage: thumbnailPageIndex > 0,
  };
};
