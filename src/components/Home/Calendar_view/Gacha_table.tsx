import { useState } from "react";

import Cards from "../../../assets/json/cards.json";
import { useTheme } from "../../../context/Theme_toggle";
import type { BannerTypes, CardState, CardsTypes } from "../types";
import CountdownTimer from "../Countdown_timer";
import CardModal from "../Card_modal";

export default function GachaTable({
  filteredBanners,
}: {
  filteredBanners: BannerTypes[];
}) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [cardState, setCardState] = useState<CardState>({
    cardId: 0,
    rarity: 4,
    trainedUrl: "",
    untrainedUrl: "",
    lastName: "",
    firstName: "",
    cardName: "",
    cardAttribute: "",
  });

  const formatId = (id: number) => String(id).padStart(4, "0");
  const today = Date.now();

  function convertToDays(ms: number) {
    return Math.floor(ms / (1000 * 60 * 60 * 24));
  }

  const handleCardClick = (card: CardsTypes) => {
    const [lName, fName] = card.character.split(" ");
    setCardState({
      cardId: card.id,
      rarity: card.rarity,
      trainedUrl: `/images/cards/${card.id}_t.webp`,
      untrainedUrl: `/images/cards/${card.id}_ut.webp`,
      lastName: lName,
      firstName: fName,
      cardName: card.name,
      cardAttribute: card.attribute,
    });
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.src = "/images/banners/placeholder.png";
    target.onerror = null;
  };

  return (
    <div
      className={`flex flex-col ${
        theme == "light" ? "bg-bg-light-mode" : "bg-bg-dark-mode2"
      }`}
    >
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
        const diffInMs = today - endDate;
        const diffInDays = convertToDays(diffInMs);
        const upcomingDiffInMs = startDate - today;

        const gachaBannerImage = `/images/banners/${formattedGachaId}.webp`;

        return (
          <div
            className="flex flex-row p-5 border-b border-gray-400"
            key={banner.id}
          >
            {/* GACHA */}
            <div className="w-1/2 flex flex-col items-center justify-center ">
              <img
                src={gachaBannerImage}
                style={{ width: "150px" }}
                onError={handleImageError}
                alt={banner.name}
              />
              <span className="text-md text-center">{banner.name}</span>
              <div
                className={`flex flex-cols text-sm text-center gap-3 ${
                  theme == "light" ? "text-text-deco-light-mode" : "text-mizuki"
                }`}
              >
                <span>{formattedStart}</span>
                <span>{formattedEnd}</span>
              </div>
            </div>
            {/* CARDS */}
            <div className="w-1/2  flex flex-col items-center justify-center">
              {/* START DATE IF UPCOMING BANNER */}
              {upcomingDiffInMs > 0 && (
                <div className="flex flex-col justify-center items-center">
                  <div>Starts in</div> <CountdownTimer startDate={startDate} />
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
              {diffInDays >= 0 && <div>{diffInDays} days ago</div>}
              {diffInDays < 0 && <div>Ends in {diffInDays * -1} days</div>}
            </div>
          </div>
        );
      })}
      <CardModal isOpen={isOpen} onClose={handleCloseModal} {...cardState} />
    </div>
  );
}
