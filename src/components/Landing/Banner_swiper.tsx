
import type { BannerTypes } from "../../types/common";
import { imgHost } from "../../constants/common";
import { useCarousel } from "./useCarousel";

interface CarouselProps {
  latestBanners: BannerTypes[];
  n: number;
  currentIndex: number; 
  setSelectedBannerId: (id: number) => void;
}

export default function Carousel({ 
  latestBanners, 
  n, 
  currentIndex, 
  setSelectedBannerId 
}: CarouselProps) {
  const maxThumbnails = 4;

  const {
    thumbnailPages,
    nextThumbnailPage,
    prevThumbnailPage,
    getVisibleThumbnails,
    getGlobalIndex,
    canGoToNextThumbnailPage,
    canGoToPrevThumbnailPage,
    goToSlide,
  } = useCarousel({ 
    latestBanners, 
    maxThumbnails,
    currentIndex 
  });

  const handleGoToSlide = (index: number) => {
    goToSlide(index);
    setSelectedBannerId(latestBanners[index].id);
  };

  const handleGoToPrev = () => {
    const newIndex = currentIndex === 0 ? latestBanners.length - 1 : currentIndex - 1;
    handleGoToSlide(newIndex);
  };

  const handleGoToNext = () => {
    const newIndex = currentIndex === latestBanners.length - 1 ? 0 : currentIndex + 1;
    handleGoToSlide(newIndex);
  };

  const handleThumbnailClickWithId = (index: number) => {
    if (index !== currentIndex) {
      handleGoToSlide(index);
    }
  };

  const imgPath = n === 0 ? `${imgHost}/jp_banners` : `${imgHost}/en_banners`;

  return (
    <div className="max-w-[450px] mx-auto">
      <div className="relative overflow-hidden rounded-xl">
        {/* SLIDE CONTAINER */}
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {latestBanners.map((banner, index) => {
            const path = n === 0 ? `${imgHost}/jp_banners` : `${imgHost}/en_banners`;
            return (
              <div key={index} className="w-full flex-shrink-0">
                <div className="flex items-center justify-center">
                  <img
                    src={`${path}/${banner.id}.webp`}
                    alt={`Slide ${index + 1}`}
                    className="object-contain max-w-full"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* NAVIGATION BUTTONS */}
        <button
          onClick={handleGoToPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
          aria-label="Previous slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={handleGoToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
          aria-label="Next slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* PAGINATION */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {latestBanners.map((banner, index) => (
            <button
              key={banner.name}
              onClick={() => handleGoToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? "bg-[#50a0fd]" : "bg-gray-500"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* THUMBNAILS CONTAINER*/}
      <div className="mt-4 flex items-center">
        {thumbnailPages > 1 && canGoToPrevThumbnailPage && (
          <button
            onClick={prevThumbnailPage}
            className=" mr-2 text-gray-600 hover:text-gray-900"
            aria-label="Previous thumbnails"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}

        {/* THUMBNAILS */}
        <div className="flex space-x-2 overflow-hidden flex-grow justify-center">
          {getVisibleThumbnails().map((banner, localIndex) => {
            const globalIndex = getGlobalIndex(localIndex);

            return (
              <button
                key={globalIndex}
                onClick={() => handleThumbnailClickWithId(globalIndex)}
                className={`flex-shrink-0 ${
                  latestBanners.length >= 4
                    ? "w-1/4"
                    : latestBanners.length <= 2
                    ? "w-1/2"
                    : "w-1/3"
                } p-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                  globalIndex === currentIndex ? "opacity-100" : "opacity-50"
                }`}
                aria-label={`View slide ${globalIndex + 1}`}
              >
                <img
                  src={`${imgPath}/${banner.id}.webp`}
                  alt={`Thumbnail ${globalIndex + 1}`}
                  className=" h-full object-cover"
                />
              </button>
            );
          })}
        </div>

        {/* NEXT THUMBNAIL */}
        {thumbnailPages > 1 && canGoToNextThumbnailPage && (
          <button
            onClick={nextThumbnailPage}
            className="p-2 ml-2 text-gray-600 hover:text-gray-900"
            aria-label="Next thumbnails"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

