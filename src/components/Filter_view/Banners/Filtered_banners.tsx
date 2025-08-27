import { useState, useEffect, useRef, useMemo } from "react";
import { useServer } from "../../../context/Server";
import { useTheme } from "../../../context/Theme_toggle";
import EnBanners from "../../../assets/json/en_banners.json";
import JpBanners from "../../../assets/json/jp_banners.json";
import type {
  SelectedBannerFilterTypesProps,
} from "../FilterTabTypes";
import type { BannerTypes } from "../../../types/common";
import { CHARACTERS } from "../../../constants/common";
import BannerContainer from "../../BannerContainer/Banner_Container";
import Pagination from "../Ui/Pagination";

export default function FilteredBanners({
  selectedBannerFilters,
}: SelectedBannerFilterTypesProps) {
  const { server } = useServer();
  const [filteredBanners, setFilteredBanners] = useState<BannerTypes[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [bannersPerPage] = useState(10);
  const [shouldScrollToTop, setShouldScrollToTop] = useState(false);
  const [hideFutureBanners, setHideFutureBanners] = useState(true);
  const { theme } = useTheme();

  const filteredBannersRef = useRef<HTMLDivElement>(null);

  // Calculate pagination
  const totalPages = Math.ceil((filteredBanners?.length || 0) / bannersPerPage);
  const startIndex = (currentPage - 1) * bannersPerPage;
  const endIndex = startIndex + bannersPerPage;

  // prevent unnecessary re-renders
  const currentBanners = useMemo(() => {
    return filteredBanners?.slice(startIndex, endIndex) || [];
  }, [filteredBanners, startIndex, endIndex]);

  useEffect(() => {
    const bannersArr = server === "global" ? EnBanners : JpBanners;

    let filtered = [...bannersArr];

    //Filter out future banners if enabled
    if (hideFutureBanners) {
      const currentTime = Date.now();
      filtered = filtered.filter((banner) => banner.start <= currentTime);
    }

    if (selectedBannerFilters["Banner Type"].length > 0) {
      filtered = filtered.filter((banner) =>
        selectedBannerFilters["Banner Type"].includes(banner.banner_type)
      );
    }

    if (selectedBannerFilters.Characters.length > 0) {
      filtered = filtered.filter((banner) => {
        // Convert selected character names to their corresponding IDs
        const selectedCharacterIds = selectedBannerFilters.Characters.map(
          (characterName: string) => {
            const index = CHARACTERS.indexOf(characterName);
            return index !== -1 ? index + 1 : null;
          }
        ).filter((id) => id !== null);

        // return if no valid character IDs
        if (selectedCharacterIds.length === 0) {
          return false;
        }

        if (selectedBannerFilters.characterFilterMode === "all") {
          return selectedCharacterIds.every((characterId) =>
            banner.characters.includes(characterId)
          );
        } else {
          return selectedCharacterIds.some((characterId) =>
            banner.characters.includes(characterId)
          );
        }
      });
    }

    if (selectedBannerFilters.search.trim() !== "") {
      const searchTerm = selectedBannerFilters.search.toLowerCase().trim();
      filtered = filtered.filter((banner) => {
        // Check banner name first
        const nameMatch =
          banner.name?.toLowerCase().includes(searchTerm) || false;

        // Check keywords if they exist
        const keywordMatch =
          banner.keywords?.some((keyword) =>
            keyword.toLowerCase().includes(searchTerm)
          ) || false;

        return nameMatch || keywordMatch;
      });
    }

    filtered.sort((a, b) => b.start - a.start);

    setFilteredBanners(filtered);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [selectedBannerFilters, server, hideFutureBanners]);

  // handle scroll after content load
  useEffect(() => {
    if (shouldScrollToTop) {
      // ensure DOM updated
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
        }, 100);
      });
    }
  }, [currentPage, currentBanners, shouldScrollToTop]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setShouldScrollToTop(true);
  };

  return (
    <div
      className={`${theme == "light" ? "bg-[#f9fafb]" : "bg-[#101828]"} `}
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
      <BannerContainer
        filteredBanners={currentBanners}
        parentRef={filteredBannersRef}
      />

      {/** PAGINATION**/}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      )}
    </div>
  );
}
