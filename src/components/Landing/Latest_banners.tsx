import { useProsekaData } from "../../context/Data";
import { useTheme } from "../../context/Theme_toggle";
import { today } from "../../constants/common";
import BannerSwiper from "./Banner_swiper";
type LatestBannersProps = {
  n: number;
};

const allowedBanners = [
  "Collab",
  "Unit Limited Event",
  "Limited Event",
  "Birthday",
  "Event",
  "Limited Event Rerun",
];
export default function LatestBanners({ n }: LatestBannersProps) {
  const { theme } = useTheme();
  const { jpBanners, enBanners } = useProsekaData();

  const bannerArray = n === 0 ? jpBanners : enBanners;

  const latestBanners = bannerArray
    .filter((banner) => {
      const isOngoing = banner.start < today && banner.end > today;
      const isAllowed = allowedBanners.includes(banner.banner_type);
      return isOngoing && isAllowed;
    })
    .sort((a, b) => {
      const orderA = allowedBanners.indexOf(a.banner_type);
      const orderB = allowedBanners.indexOf(b.banner_type);
      return orderA - orderB;
    });

  return (
    <div
      className={`rounded-3xl p-1 shadow-xl border transition-all duration-500 hover:shadow-2xl ${
        theme === "dark"
          ? "bg-[#1e2939] border-[#152857] hover:border-[#50a0fd]/50"
          : "bg-white border-gray-200 hover:border-blue-300"
      }`}
    >
      <div className="flex items-center mb-6">
        <div
          className={`w-4 h-4 rounded-full mr-4 ${
            theme === "dark" ? "bg-[#50a0fd]" : "bg-blue-500"
          }`}
        ></div>
        <h2
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {n === 0 ? "JP" : "EN"} Server
        </h2>
      </div>
      <div
        className={`min-h-[250px] rounded-2xl   flex items-center justify-center transition-colors duration-300 ${
          theme === "dark"
            ? "border-gray-600 text-gray-400"
            : "border-gray-300 text-gray-500"
        } `}
      >
        <BannerSwiper latestBanners={latestBanners} n={n} />
      </div>
    </div>
  );
}
