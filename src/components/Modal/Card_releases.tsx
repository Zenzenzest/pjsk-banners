import EnBanners from "../../assets/json/en_banners.json";
import JpBanners from "../../assets/json/jp_banners.json";
import { useTheme } from "../../context/Theme_toggle";
import type { CardReleasesType } from "../Types";

export default function CardReleases({ cardId }: CardReleasesType) {
  const { theme } = useTheme();

  const allowedBannerTypes = [
    "World Link Support",
    "Limited Event Rerun",
    "Limited Event",
    "Event",
    "Unit Limited Event",
    "Bloom Festival",
    "Colorful Festival",
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

  const JpAppearances = JpBanners.filter((banner) => {
    return (
      banner.cards.includes(cardId) &&
      allowedBannerTypes.includes(banner.banner_type)
    );
  });
  const EnAppearances = EnBanners.filter((banner) => {
    return (
      banner.cards.includes(cardId) &&
      allowedBannerTypes.includes(banner.banner_type)
    );
  });

  return (
    <div
      className={`w-full p-2 ${
        theme === "dark" ? "text-gray-300" : "text-[#101828]"
      }`}
    >
      <div className="gap-6 w-full">
        {JpAppearances.map((banner) => {
          return (
            <div
              className="grid grid-cols-2 gap-3 border-b border-gray-500"
              key={banner.id}
            >
              {" "}
              <div className="md:truncate flex flex-row justify-start items-center gap-1">
                <span>
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 36 36"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="36" height="36" fill="#fff" />
                    <circle cx="18" cy="18" r="8" fill="#bc002d" />
                  </svg>
                </span>
                <span>{banner.name}</span>
              </div>
              <div className="grid grid-cols-2">
                <span>{dateFormatter(banner.start)}</span>
                <span>{dateFormatter(banner.end)}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="gap-6 w-full">
        {EnAppearances.map((banner) => {
          return (
            <div
              className="grid grid-cols-2 gap-3 border-b border-gray-500"
              key={banner.id}
            >
              {" "}
              <div className="md:truncate flex flex-row justify-start items-center gap-1">
                <span>
                  <svg
                    width={15}
                    height={15}
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
                <span>{banner.name}</span>
              </div>
              <div className="grid grid-cols-2">
                <span>{dateFormatter(banner.start)}</span>
                <span>{dateFormatter(banner.end)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
