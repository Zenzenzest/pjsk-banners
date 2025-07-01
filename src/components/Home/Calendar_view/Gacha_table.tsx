import { useState } from "react";
import JpBanners from "../../../assets/json/jp_banners.json";
import Cards from "../../../assets/json/cards.json";
import { useTheme } from "../../../context/Theme_toggle";
import type { BannerTypes, CardState, CardsTypes } from "../types";
import CountdownTimer from "../Countdown_timer";
import CardModal from "../Card_modal";
import { useServer } from "../../../context/Server";
import EventEndedTimer from "../EventEnded_timer";
export default function GachaTable({
  filteredBanners,
  selectedYear,
  selectedMonth,
}: {
  filteredBanners: BannerTypes[];
}) {
  const { theme } = useTheme();
  const { server } = useServer();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(true);
  const [cardState, setCardState] = useState<CardState>({
    cardId: 0,
    rarity: 4,

    lastName: "",
    firstName: "",
    cardName: "",
    cardAttribute: "",
  });

  const formatId = (id: number) => String(id).padStart(4, "0");
  const today = Date.now();

  const handleCardClick = (card: CardsTypes) => {
    const [lName, fName] = card.character.split(" ");
    setCardState({
      cardId: card.id,
      rarity: card.rarity,
      lastName: lName,
      firstName: fName,
      cardName: card.name,
      cardAttribute: card.attribute,
    });
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsLoading(true);
    setIsLoading(true);
    setIsOpen(false);
  };

  // Will use JP banner image if no EN banner image
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;

    target.onerror = null;

    const en_id = Number(e.target.alt);
    const jp_variant = JpBanners.find((item) => item.en_id == en_id);
    if (jp_variant) {
      const jp_id = formatId(jp_variant["id"]);

      target.src = `/images/jp_banners/${jp_id}.webp`;
    } else {
      target.src = `/images/banners/placeholder.jpg`;
    }
  };

  return (
    <div
      className={`flex flex-col ${
        theme == "light" ? "bg-bg-light-mode" : "bg-bg-dark-mode"
      }`}
    >
      {/* DISCLAIMER */}
      {((selectedMonth >= 8 && selectedYear === 2025) ||
        selectedYear >= 2026) && (
        <div className="text-sm italic text-gray-500 dark:text-gray-400 mt-1 mb-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
          Note: August 2025 onward are estimates based on JP server and will
          be updated upon official announcements.
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
                {banner.start && banner.type != "confirmed" && (
                  <div className="flex items-center">
                    <span className="hidden sm:inline mr-1">Start:</span>
                    <span className="bg-white/10 px-2 py-1 rounded-md">
                      {formattedStart}
                    </span>
                  </div>
                )}
                {banner.end && banner.type != "confirmed" && (
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
              {today < Number(banner.start) && banner.type != "confirmed" && (
                <div className="flex flex-col justify-center items-center">
                  <CountdownTimer targetDate={startDate} mode="start" />
                </div>
              )}

              <div className="flex flex-row items-center justify-evenly flex-wrap ">
                {banner["cards"].map((card, i) => {
                  const formattedCardId = formatId(card);
                  const cardIconImage = `/images/card_icons/${formattedCardId}_t.webp`;

                  return (
                    <div
                      key={i}
                      className="flex flex-col justify-center items-center text-xs"
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
