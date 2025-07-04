import { useState, useEffect, useRef } from "react";
import JpBanners from "../../../assets/json/jp_banners.json";
import EnEvents from "../../../assets/json/en_events.json";
import JpEvents from "../../../assets/json/jp_events.json";

import Cards from "../../../assets/json/cards.json";
import { useTheme } from "../../../context/Theme_toggle";
import type { CardState, GachaBannersProps, AllCardTypes } from "../types";
import CountdownTimer from "../Countdown_timer";
import CardModal from "../Card_modal";
import { useServer } from "../../../context/Server";
import EventEndedTimer from "../EventEnded_timer";

export default function GachaTable({
  filteredBanners,
  selectedYear,
  selectedMonth,
  parentRef,
}: GachaBannersProps) {
  const { theme } = useTheme();
  const { server } = useServer();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardState, setCardState] = useState<CardState>({
    cardId: 0,
    rarity: 4,
    name: "",
    cardName: "",
    cardAttribute: "",
    sekaiId:0
  });

  const formatId = (id: number) => String(id).padStart(4, "0");
  const today = Date.now();

  // Handle scroll detection, checks window scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Show button when scrolled near the bottom of the page
      const isNearBottom = scrollTop + windowHeight >= documentHeight - 1000;
      setShowScrollButton(isNearBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top of parent  component
  const scrollToTop = () => {
    if (parentRef.current) {
      parentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      // Fallback to scroll to top of page
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleCardClick = (card: AllCardTypes) => {
 
    setCardState({
      cardId: card.id,
      rarity: card.rarity,
      name: card.character,
      cardName: card.name,
      cardAttribute: card.attribute,
      sekaiId: card.jp_sekai_id
    });
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsLoading(true);
    setIsLoading2(true);
    setIsOpen(false);
  };

  // Will use JP banner image if no EN banner image
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.currentTarget;
    target.onerror = null; // Prevent infinite loop

    const en_id = Number(target.alt);
    const jp_variant = JpBanners.find((item) => item.en_id == en_id);

    target.src = jp_variant
      ? `/images/jp_banners/${formatId(jp_variant.id)}.webp`
      : "/images/banners/placeholder.jpg";
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className={`flex flex-col ${
          theme == "light" ? "bg-bg-light-mode" : "bg-bg-dark-mode"
        }`}
      >
        {/* DISCLAIMER */}
        {((selectedMonth >= 8 && selectedYear === 2025) ||
          selectedYear >= 2026) && (
          <div
            className={`text-sm italic mb-3 px-4 py-2 mx-3 rounded-lg ${
              theme === "dark"
                ? "text-gray-400 bg-gray-800"
                : "text-gray-700 bg-gray-200"
            }`}
          >
            Note: Global server typically follows JP server with:
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>
                <strong>Event banners:</strong> Exactly 1 year gap
              </li>
              <li>
                <strong>Rerun banners:</strong> Approximately 350-380 day gap (1
                year & ±15 days)
              </li>
            </ul>
            Dates will be adjusted when officially announced.
          </div>
        )}
        {filteredBanners.map((banner) => {
          const formattedGachaId = formatId(banner.id);
          const startDate = new Date(Number(banner.start));
          const endDate = new Date(Number(banner.end));
          const formattedStart = startDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
          const formattedEnd = endDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          const gachaBannerImage =
            server === "global"
              ? `/images/banners/${formattedGachaId}.webp`
              : `/images/jp_banners/${formattedGachaId}.webp`;

          // Get shop cards for this specific banner
          const bannerShopCards = banner.event_id
            ? EnEvents.find((item) => item.id == banner.event_id)?.cards.filter(
                (eventCard) => !banner.cards.includes(eventCard)
              ) || []
            : [];

          return (
            <div
              className="flex flex-row p-5 border-t border-gray-400"
              key={banner.id}
            >
              {/* GACHA */}
              <div className="w-1/2 flex flex-col items-center justify-center gap-1">
                {/* BANNER IMAGE*/}
                <div className="relative group">
                  <img
                    src={gachaBannerImage}
                    className="w-36 h-auto rounded-lg shadow-md transition-transform group-hover:scale-105"
                    onError={handleImageError}
                    alt={`${banner.id}`}
                  />
                </div>
                {/* BANNER NAME */}
                <span
                  className={` sm:text-sm md:text-base font-bold text-center ${
                    theme == "light" ? "text-gray-800" : "text-gray-100"
                  }`}
                >
                  {banner.name}
                </span>
                {/* BANNER TYPE */}
                <div className="text-[15px]">
                  &#x28;{banner.banner_type}&#x29;
                </div>{" "}
                {banner.type === "confirmed" && (
                  <h1 className="text-xl text-center font-extrabold bg-gradient-to-r from-emerald-500 via-lime-400 to-green-600 text-transparent bg-clip-text animate-pulse">
                    {banner.confirmation}
                  </h1>
                )}
                {/* DATE RANGE*/}
                <div
                  className={`flex flex-col md:flex-row items-center gap-1 sm:gap-3 text-sm ${
                    theme == "light" ? "text-gray-600" : "text-gray-300"
                  }`}
                >
                  {banner.type != "confirmed" &&
                    banner.type != "rerun_estimation" && (
                      <div className="flex items-center">
                        <span className="hidden sm:inline mr-1">Start:</span>
                        <span className="bg-white/10 px-2 py-1 rounded-md">
                          {formattedStart}
                        </span>
                      </div>
                    )}
                  {banner.type != "confirmed" &&
                    banner.type != "rerun_estimation" && (
                      <div className="flex items-center">
                        <span className="hidden sm:inline mr-1">End:</span>
                        <span className="bg-white/10 px-2 py-1 rounded-md">
                          {formattedEnd}
                        </span>
                      </div>
                    )}
                </div>
              </div>
              {/* CARDS */}
              <div className="w-1/2  flex flex-col items-center justify-center">
                {/* START DATE IF UPCOMING BANNER */}
                {today < Number(banner.start) &&
                  banner.type != "confirmed" &&
                  banner.type != "rerun_estimation" && (
                    <div className="flex flex-col justify-center items-center">
                      <CountdownTimer targetDate={startDate} mode="start" />
                    </div>
                  )}
                {banner.type == "rerun_estimation" && banner.rerun && (
                  <div className="flex flex-row">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 font-bold">
                      {Math.floor((banner.rerun[0] - today) / 86400000)} -{" "}
                      {Math.floor((banner.rerun[1] - today) / 86400000)} Days
                    </div>
                  </div>
                )}
                <div>
                  <div className="flex flex-row items-center justify-evenly flex-wrap ">
                    {banner["cards"].map((card, i) => {
                      const formattedCardId = formatId(card);
                      const cardIconImage = `/images/card_icons/${formattedCardId}_t.webp`;

                      return (
                        <div
                          key={i}
                          className="flex flex-col justify-center items-center text-xs cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          <img
                            src={cardIconImage}
                            onClick={() => handleCardClick(Cards[card - 1])}
                            style={{
                              width: "60px",
                              height: "auto",
                              margin: "0.3rem",
                            }}
                          />
                          {card}
                        </div>
                      );
                    })}
                  </div>
                  {/* SHOP CARDS */}
                  {bannerShopCards.length > 0 && (
                    <div className="shop-cards flex flex-row items-center justify-evenly flex-wrap mt-2 bg-blue-50/80 dark:bg-blue-900/20 border-1 border-blue-400 rounded-lg shadow-sm mb-2 relative">
                      <div
                        className={` dark:bg-blue-200 border-1 border-blue-400 absolute -top-3 left-1/2 transform -translate-x-1/2  px-1 text-blue-500 font-bold text-center w-4/5 rounded-lg ${
                          theme == "dark" ? "bg-[#0e1721]" : "bg-[#f2f2f2]"
                        }`}
                      >
                        EVENT SHOP
                      </div>
                      {bannerShopCards.map((shopCard, i) => {
                        const EnEventCard = Cards.find(
                          (item) => shopCard == item.id
                        );

                        const formattedCardId = formatId(shopCard);

                        const cardIconImage =
                          EnEventCard && EnEventCard.rarity == 3
                            ? `/images/card_icons/${formattedCardId}_t.webp`
                            : `/images/card_icons/${formattedCardId}.webp`;

                        return (
                          <div
                            key={`shop-${i}`}
                            className="flex flex-col pt-5 justify-center items-center text-xs cursor-pointer hover:opacity-80 transition-opacity"
                          >
                            <img
                              src={cardIconImage}
                              onClick={() =>
                                handleCardClick(Cards[shopCard - 1])
                              }
                              style={{
                                width: "60px",
                                height: "auto",
                                margin: "0.3rem",
                              }}
                            />
                            {/* {shopCard} */}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                {/*  */}
                {today > Number(banner.end) && (
                  <EventEndedTimer endDate={endDate} />
                )}

                {today > Number(banner.start) && today < Number(banner.end) ? (
                  <div>
                    {endDate.getTime() < 2000000000000 && (
                      <div className="flex flex-col justify-center items-center">
                        <CountdownTimer targetDate={endDate} mode="end" />
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* SCROLL BUTTON TO TOP */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
            theme === "light"
              ? "bg-highlight-dark-mode text-white hover:bg-opacity-90"
              : "bg-highlight-dark-mode text-white hover:bg-opacity-90"
          }`}
          aria-label="Scroll to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}

      <CardModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        {...cardState}
        isLoading={isLoading}
        isLoading2={isLoading2}
        setIsLoading={setIsLoading}
        setIsLoading2={setIsLoading2}
      />
    </div>
  );
}
