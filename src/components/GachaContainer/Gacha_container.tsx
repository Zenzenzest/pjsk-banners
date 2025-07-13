import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/Theme_toggle";
import type {
  CardState,
  GachaBannersProps,
  AllCardTypes,
} from "../Global/Types";
import CardModal from "../Shared/Card_modal";
import { useServer } from "../../context/Server";
import Disclaimer from "./Disclaimer";

import type { BannerTypes } from "./Gacha_types";
import BannerTemplate from "./Banner_template";

export default function BannerContainer({
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
    sekaiId: 0,
  });
  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight;
      const isAwayFromTheTop = scrollTop > documentHeight * 0.1;
      setShowScrollButton(isAwayFromTheTop);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    if (parentRef.current) {
      parentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCardClick = (card: AllCardTypes) => {
    setCardState({
      cardId: card.id,
      rarity: card.rarity,
      name: card.character,
      cardName: card.name,
      cardAttribute: card.attribute,
      sekaiId: card.jp_sekai_id,
    });
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsLoading(true);
    setIsLoading2(true);
    setIsOpen(false);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 pb-10 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      } ${server === "saved" ? "mt-2" : ""}`}
    >
      <div ref={containerRef} className="max-w-7xl  mx-auto px-1 py-1">
        {/* DISCLAIMER */}
        {((selectedMonth &&
          selectedYear &&
          ((selectedMonth >= 8 && selectedYear === 2025) ||
            selectedYear >= 2026)) ||
          server === "saved") && <Disclaimer />}

        <div className="pb-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBanners.map((banner: BannerTypes) => {
            let mode = "";

            return (
              <div
                key={banner.id}
                className={`relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className=" gap-2 p-2 sm:p-4 lg:p-6">
                  {banner.event_id ? (
                    <div className={`grid grid-cols-2 gap-2 sm:gap-4 lg:gap-6`}>
                      {Array(2)
                        .fill(0)
                        .map((_, i) => {
                          if (i === 0) {
                            mode = "gacha";
                          } else {
                            mode = "event";
                          }
                          return (
                            <BannerTemplate
                              key={i}
                              banner={banner}
                              mode={mode}
                              handleCardClick={handleCardClick}
                            />
                          );
                        })}
                    </div>
                  ) : (
                    <div className="">
                      <BannerTemplate
                        banner={banner}
                        mode="gacha"
                        handleCardClick={handleCardClick}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* SCROLL TO TOP BUTTON */}
        {showScrollButton && (
          <button
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
              theme === "dark"
                ? "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200"
                : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
            }`}
            aria-label="Scroll to top"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
      </div>

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
