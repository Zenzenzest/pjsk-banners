// useCarousel.ts - Update the hook
import { useState, useEffect, useCallback } from "react";
import type { BannerTypes } from "../../types/common";

interface UseCarouselProps {
  latestBanners: BannerTypes[];
  maxThumbnails?: number;
  currentIndex?: number;
}

export const useCarousel = ({
  latestBanners,
  maxThumbnails = 4,
}: UseCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [thumbnailPageIndex, setThumbnailPageIndex] = useState(0);

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

    // actions
    goToSlide,
    goToPrev,
    goToNext,
    handleThumbnailClick,
    nextThumbnailPage,
    prevThumbnailPage,

    // helpers
    getVisibleThumbnails,
    getGlobalIndex,
    canGoToNextThumbnailPage: thumbnailPageIndex < thumbnailPages - 1,
    canGoToPrevThumbnailPage: thumbnailPageIndex > 0,
  };
};
