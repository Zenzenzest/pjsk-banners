import { useEffect, useMemo } from "react";
import { useProsekaData } from "../../context/Data";
import { usePreloadImage } from "../../hooks/usePreloadImage";
import { today, imgHost } from "../../constants/common";
import BannerSwiper from "./Banner_swiper";
import LandingCardIcons from "./Landing_card_icons";
import { useState } from "react";
import BannerDetails from "./Banner_details";
import type { AllCardTypes, BannerTypes } from "../../types/common";

const allowedBanners = [
  "Collab",
  "Unit Limited Event",
  "Limited Event",
  "Birthday",
  "Event",
  "Limited Event Rerun",
  "World Link Support",
];

export default function LatestBanners() {
  const [selectedServer, setSelectedServer] = useState(0);

  const { jpBanners, enBanners, allCards, jpEvents } = useProsekaData();
  const [selectedBannerId, setSelectedBannerId] = useState<number>(0);
  const bannerArray = selectedServer === 0 ? jpBanners : enBanners;

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

  // Calculate currentIndex based on selectedBannerId
  const currentIndex = latestBanners.findIndex(
    (banner) => banner.id === selectedBannerId
  );

  const getCardImagePath = (card: AllCardTypes) => {
    const imgPath =
      card.rarity === 5
        ? "_bd.webp"
        : card.rarity === 4 || card.rarity === 3
        ? "_t.webp"
        : ".webp";
    return `${imgHost}/icons/${card.id}${imgPath}`;
  };

  const getBannerImagePath = (banner: BannerTypes) => {
    let imgPath = "";
    if ("en_id" in banner) {
      imgPath = `${imgHost}/jp_banners/${banner.id}.webp`;
    } else {
      imgPath = `${imgHost}/en_banners/${banner.id}.webp`;
    }

    return imgPath;
  };

  const getCardsForBanner = useMemo(() => {
    return (banner: BannerTypes) => {
      if (!banner) return [];

      if (banner.event_id) {
        const eventData = jpEvents.find((ev) => ev.id === banner.event_id);
        return allCards.filter((card) => eventData?.cards.includes(card.id));
      } else {
        return allCards.filter((card) => banner.cards.includes(card.id));
      }
    };
  }, [jpEvents, allCards]);

  const getLatestBanners = (banners: BannerTypes[]) => {
    return banners.filter((banner) => {
      const isOngoing = banner.start < today && banner.end > today;
      const isAllowed = allowedBanners.includes(banner.banner_type);
      return isOngoing && isAllowed;
    });
  };

  const allImageUrls = useMemo(() => {
    if (
      jpBanners.length === 0 ||
      enBanners.length === 0 ||
      allCards.length === 0
    ) {
      return [];
    }

    const jpLatestBanners = getLatestBanners(jpBanners);
    const enLatestBanners = getLatestBanners(enBanners);
    const allImageUrls: string[] = [];

    // Collect icon and banner images
    [...jpLatestBanners, ...enLatestBanners].forEach((banner) => {
      allImageUrls.push(getBannerImagePath(banner));

      const cards = getCardsForBanner(banner);
      cards.forEach((card) => {
        allImageUrls.push(getCardImagePath(card));
      });
    });

    return allImageUrls;
  }, [jpBanners, enBanners, allCards, getCardsForBanner]);

  //  preload all images
  usePreloadImage(allImageUrls);

  useEffect(() => {
    if (latestBanners.length > 0) {
      if (currentIndex === -1) {
        setSelectedBannerId(latestBanners[0].id);
      }
    } else {
      setSelectedBannerId(0);
    }
  }, [latestBanners, currentIndex]);

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl transition-all duration-300 bg-slate-800/40 border border-slate-700/30 `}
    >
      <div
        className={`relative rounded-3xl p-6 transition-all duration-300 bg-slate-800/20 border border-slate-700/20 `}
      >
        {/* HEADER  */}
        <div className="relative flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div
              className={`w-4 h-4 rounded-full ${
                selectedServer === 0 ? "bg-rose-500/80" : "bg-teal-500/80"
              }`}
            />
            <h2 className={`text-2xl font-bold "text-white"`}>Live Banners</h2>
          </div>

          {/* SERVER TOGGLLE*/}
          <div className="flex space-x-4 ">
            <button
              onClick={() => setSelectedServer(0)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedServer === 0
                  ? "bg-rose-500/80 text-white"
                  : "bg-slate-700/40 text-gray-300"
              }`}
            >
              JP
            </button>
            <button
              onClick={() => setSelectedServer(1)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedServer === 1
                  ? "bg-teal-500/80 text-white"
                  : "bg-slate-700/40 text-gray-300"
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="relative rounded-2xl transition-all duration-300 min-h-[280px] flex flex-col sm:flex-row justify-start items-center">
          <div className="flex flex-col justify-center items-center w-full sm:w-2/3">
            {/* CARDS*/}
            <div className="min-h-[50px] w-full">
              <LandingCardIcons
                selectedBannerId={selectedBannerId}
                n={selectedServer}
              />
            </div>
            {/* CAROUSEL */}
            <div className="min-h-[200px] flex items-center justify-center">
              <BannerSwiper
                latestBanners={latestBanners}
                n={selectedServer}
                currentIndex={currentIndex}
                setSelectedBannerId={setSelectedBannerId}
              />
            </div>
          </div>
          <div className="w-full sm:w-1/3">
            <BannerDetails />
          </div>
        </div>
      </div>
    </div>
  );
}
