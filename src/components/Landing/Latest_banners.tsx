import { useEffect } from "react";
import { useProsekaData } from "../../context/Data";
import { useTheme } from "../../context/Theme_toggle";
import { today } from "../../constants/common";
import BannerSwiper from "./Banner_swiper";
import LandingCards from "./Landing_cards";
import { useState } from "react";

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
  const [selectedBannerId, setSelectedBannerId] = useState<number>(0);
  const bannerArray = n === 0 ? jpBanners : enBanners;
  const isDark = theme === "dark";

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

  const isJP = n === 0;
  useEffect(() => {
    if (latestBanners.length > 0 && selectedBannerId === 0) {
      setSelectedBannerId(latestBanners[0].id);
    }
  }, [latestBanners, selectedBannerId]);

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl transition-all duration-300 hover:shadow-2xl ${
        isDark
          ? "bg-slate-800/40 border border-slate-700/30 backdrop-blur-sm"
          : "bg-white/10 border border-gray-200/60 backdrop-blur-sm"
      }`}
    >
      <div
        className={`relative rounded-3xl p-6 transition-all duration-300 ${
          isDark
            ? "bg-slate-800/20 border border-slate-700/20"
            : "bg-white/40 border border-gray-200/40"
        }`}
      >
        {/* HEADER*/}
        <div className="relative flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div
              className={`w-4 h-4 rounded-full ${
                isJP
                  ? isDark
                    ? "bg-rose-500/80"
                    : "bg-rose-400/80"
                  : isDark
                  ? "bg-teal-500/80"
                  : "bg-teal-400/80"
              }`}
            />
            <div>
              <h2
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {isJP ? "JP" : "EN"} Server
              </h2>
              <div
                className="h-0.5 w-full rounded-full mt-1 transition-all duration-300"
                style={{
                  backgroundColor: isJP ? "#f87171" : "#2dd4bf",
                }}
              />
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div
          className={`relative rounded-2xl transition-all duration-300 min-h-[280px] ${
            isDark
              ? "bg-slate-800/20 border border-slate-700/20"
              : "bg-white/20 border border-gray-200/40"
          }`}
        >
          {/* CARDS*/}
          <div className="min-h-[50px]">
            <LandingCards selectedBannerId={selectedBannerId} n={n} />
          </div>
          {/* CAROUSEL */}
          <div className="min-h-[200px] flex items-center justify-center">
            <BannerSwiper
              latestBanners={latestBanners}
              n={n}
              setSelectedBannerId={setSelectedBannerId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
