import { useState, useEffect, useRef } from "react";
import { useServer } from "../../../context/Server";
import { useTheme } from "../../../context/Theme_toggle";
import EnBanners from "../../../assets/json/en_banners.json";
import JpBanners from "../../../assets/json/jp_banners.json";
import type { FilteredBannersPropType, BannerTypes } from "../../Global/Types";
import GachaTable from "../../Shared/Gacha_table";

const characters = [
  "Hoshino Ichika",
  "Tenma Saki",
  "Mochizuki Honami",
  "Hinomori Shiho",
  "Hanasato Minori",
  "Kiritani Haruka",
  "Momoi Airi",
  "Hinomori Shizuku",
  "Azusawa Kohane",
  "Shiraishi An",
  "Shinonome Akito",
  "Aoyagi Toya",
  "Tenma Tsukasa",
  "Otori Emu",
  "Kusanagi Nene",
  "Kamishiro Rui",
  "Yoisaki Kanade",
  "Asahina Mafuyu",
  "Shinonome Ena",
  "Akiyama Mizuki",
  "Hatsune Miku",
  "Kagamine Rin",
  "Kagamine Len",
  "Megurine Luka",
  "MEIKO",
  "KAITO",
];

export default function FilteredBanners({
  selectedFilters,
}: FilteredBannersPropType) {
  const { server } = useServer();
  // Define a type that covers all possible banner properties

  const [filteredBanners, setFilteredBanners] = useState<BannerTypes[]>([]); // Initialize as empty array with proper type
  const [currentPage, setCurrentPage] = useState(1);
  const [bannersPerPage] = useState(10); // You can make this configurable
  const [shouldScrollToTop, setShouldScrollToTop] = useState(false);
  const [hideFutureBanners, setHideFutureBanners] = useState(true);
  const { theme } = useTheme();

  const filteredBannersRef = useRef<HTMLDivElement>(null);

  // Calculate pagination values
  const totalPages = Math.ceil((filteredBanners?.length || 0) / bannersPerPage);
  const startIndex = (currentPage - 1) * bannersPerPage;
  const endIndex = startIndex + bannersPerPage;
  const currentBanners = filteredBanners?.slice(startIndex, endIndex) || [];

  useEffect(() => {
    const bannersArr = server === "global" ? EnBanners : JpBanners;

    let filtered = [...bannersArr];

    //Filter out future banners (only if toggle is enabled)
    if (hideFutureBanners) {
      const currentTime = Date.now();
      filtered = filtered.filter((banner) => banner.start <= currentTime);
    }

    //Apply Banner Type filter
    if (selectedFilters["Banner Type"].length > 0) {
      filtered = filtered.filter((banner) =>
        selectedFilters["Banner Type"].includes(banner.banner_type)
      );
    }

    //Apply Characters filter
    if (selectedFilters.Characters.length > 0) {
      filtered = filtered.filter((banner) => {
        //* Convert selected character names to their corresponding IDs*
        const selectedCharacterIds = selectedFilters.Characters.map(
          (characterName) => {
            const index = characters.indexOf(characterName);
            return index !== -1 ? index + 1 : null;
          }
        ).filter((id) => id !== null);

        //Check if any of the banner's characters match the selected character IDs
        return (
          banner.characters?.some((characterId) =>
            selectedCharacterIds.includes(characterId)
          ) || false
        );
      });
    }

    //* Apply search filter
    if (selectedFilters.search.trim() !== "") {
      const searchTerm = selectedFilters.search.toLowerCase().trim();
      filtered = filtered.filter((banner) => {
        //* Check if banner has keywords property and it's an array*
        if (banner.keywords && Array.isArray(banner.keywords)) {
          return banner.keywords.some((keyword) =>
            keyword.toLowerCase().includes(searchTerm)
          );
        }
        //* If no keywords, also check the banner name as fallback*
        return banner.name.toLowerCase().includes(searchTerm);
      });
    }

    //* Sort by start date (latest to oldest)
    filtered.sort((a, b) => b.start - a.start);

    setFilteredBanners(filtered);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [selectedFilters, server, hideFutureBanners]); // Added hideFutureBanners to dependencies

  // Effect to handle scrolling after content loads
  useEffect(() => {
    if (shouldScrollToTop) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (filteredBannersRef.current) {
            filteredBannersRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          } else {
            // Fallback to window scroll
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }
          setShouldScrollToTop(false);
        }, 100); // Small delay to ensure GachaTable has finished rendering
      });
    }
  }, [currentPage, currentBanners, shouldScrollToTop]);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setShouldScrollToTop(true);
  };

  // Generate page numbers for pagination (matching FilteredCards logic)
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

  return (
    <div
      className={`${theme == "light" ? "bg-[#f2f2f2]" : ""} mb-20`}
      ref={filteredBannersRef}
    >
      {/** BANNER COUNT WITH TOGGLE **/}
      <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 mb-4 px-2">
        <div
          className={`text-center text-sm md:text-base ${
            theme === "light" ? "text-gray-600" : "text-gray-400"
          }`}
        >
          Showing {startIndex + 1}-
          {Math.min(endIndex, filteredBanners?.length || 0)} of{" "}
          {filteredBanners?.length || 0} banners
        </div>

        {server === "global" && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span
              className={`text-xs sm:text-sm ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Show Upcoming Banners
            </span>
            <button
              onClick={() => setHideFutureBanners(!hideFutureBanners)}
              className={`relative inline-flex h-7 w-11  items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                hideFutureBanners
                  ? theme === "light"
                    ? "bg-gray-300"
                    : "bg-gray-600"
                  : theme === "light"
                  ? "bg-blue-600"
                  : "bg-blue-500"
              }`}
              title={
                hideFutureBanners
                  ? "Show future banners"
                  : "Hide future banners"
              }
            >
              <span
                className={`inline-block h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-white transition-transform ${
                  hideFutureBanners
                    ? "translate-x-6 sm:translate-x-6"
                    : "translate-x-1 sm:translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-xs sm:text-sm ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Global Banners Only
            </span>
          </div>
        )}
      </div>

      {/** CURRENT PAGE **/}
      <GachaTable
        filteredBanners={currentBanners}
        parentRef={filteredBannersRef}
      />

      {/** PAGINATION**/}
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

            {/* PAGE NUMBERS */}
            <div className="flex items-center gap-1">
              {generatePageNumbers().map((page, index) => {
                // ON MOBILE - ONLY SHOW CURRENT PAGE AND ADJACENT PAGES
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

            {/* NEXT BUTTON */}
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
    </div>
  );
}
