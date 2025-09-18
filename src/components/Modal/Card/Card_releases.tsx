import { useProsekaData } from "../../../context/Data";
import { useTheme } from "../../../context/Theme_toggle";
import type { CardReleasesType } from "./CardModalTypes";

import { useBannerEvImg } from "../../../hooks/useBannerEvImg";
import type { BannerTypes } from "../../../types/common";

export default function CardReleases({ cardId, cardType }: CardReleasesType) {
  const { theme } = useTheme();

  const { jpBanners, enBanners } = useProsekaData();
  const allowedBannerTypes = [
    "World Link Support",
    "Limited Event Rerun",
    "Limited Event",
    "Event",
    "Unit Limited Event",
    "Bloom Festival",
    "Colorful Festival",
  ];
  const allowedOffRates = [
    "Recollection",
    "Unit Premium Gift",
    "Premium Gift",
    "Memorial Select",
    "Your Pick",
    "Bloom Festival",
  ];

  const dateFormatter = (unix: number) => {
    const date = new Date(unix);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    return formattedDate;
  };

  const JpAppearances = jpBanners
    .filter((banner) => {
      return (
        (banner.cards.includes(cardId) &&
          allowedBannerTypes.includes(banner.banner_type)) ||
        (banner.gachaDetails.includes(cardId) &&
          allowedOffRates.includes(banner.banner_type) &&
          cardType !== "permanent")
      );
    })
    .sort((a, b) => a.start - b.start);
  const EnAppearances = enBanners
    .filter((banner) => {
      return (
        (banner.cards.includes(cardId) &&
          allowedBannerTypes.includes(banner.banner_type)) ||
        (banner.gachaDetails.includes(cardId) &&
          allowedOffRates.includes(banner.banner_type) &&
          cardType !== "permanent")
      );
    })
    .sort((a, b) => a.start - b.start);

  const RenderRateUpsGrid = (banner: BannerTypes, server: string) => {
    const { bannerImageUrl, handleImageError } = useBannerEvImg({
      mode: "gacha",
      server,
      banner,
    });

    return (
      <div
        key={banner.id}
        className="relative h-20 xs:h-24 sm:h-28 md:h-32 m-1 xs:m-2 overflow-hidden rounded-lg shadow-sm"
      >
        <img
          className="w-full h-full object-cover rounded-2xl"
          src={bannerImageUrl}
          onError={handleImageError}
          alt={banner.id.toString()}
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div className="absolute bottom-1 xs:bottom-2 left-1 xs:left-2 flex items-center gap-1 xs:gap-2 text-white">
          {/* FLAGS */}
          {server === "jp" ? (
            <span className="shrink-0">
              <svg
                width={12}
                height={12}
                className="xs:w-4 xs:h-4 rounded-full shadow-sm"
                viewBox="0 0 36 36"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="36" height="36" fill="#fff" />
                <circle cx="18" cy="18" r="8" fill="#bc002d" />
              </svg>
            </span>
          ) : (
            <span>
              <svg
                width={12}
                height={12}
                className="xs:w-4 xs:h-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path d="M2 12H22" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </span>
          )}

          {/* BANENR NAME */}
          <span className="truncate font-medium text-sm md:text-lg text-gray-200">
            {banner.name}
          </span>
        </div>
        {/* BANNER DATE */}
        <span className="absolute top-1 xs:top-2 right-1 xs:right-2 text-xs md:text-lg text-gray-200 bg-black/50 px-1 xs:px-2 py-0.5 rounded-lg">
          {dateFormatter(banner.start)}
        </span>
      </div>
    );
  };

  return (
    <div
      className={`w-full p-2 xs:p-3 rounded-lg shadow-sm 
    ${theme === "dark" ? "text-gray-200 bg-gray-900" : "text-gray-800 bg-white"}
  `}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4">
        <div className="space-y-2 xs:space-y-3">
          {EnAppearances.map((banner) => RenderRateUpsGrid(banner, "global"))}
        </div>

        <div className="space-y-2 xs:space-y-3">
          {JpAppearances.map((banner) => RenderRateUpsGrid(banner, "jp"))}
        </div>
      </div>
    </div>
  );
}
