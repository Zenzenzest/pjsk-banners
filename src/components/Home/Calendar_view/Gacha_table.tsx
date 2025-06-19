import { useState } from "react";
import JpBanners from "../../../assets/json/jp_banners.json";
import Cards from "../../../assets/json/cards.json";
import { useTheme } from "../../../context/Theme_toggle";
import type { BannerTypes, CardState, CardsTypes } from "../types";
import CountdownTimer from "../Countdown_timer";
import CardModal from "../Card_modal";
import { useServer } from "../../../context/Server";

export default function GachaTable({
  filteredBanners,
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

  function convertToDays(ms: number) {
    return Math.floor(ms / (1000 * 60 * 60 * 24));
  }

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
    }
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

        const gachaBannerImage =
          server === "global"
            ? `/images/banners/${formattedGachaId}.webp`
            : `/images/jp_banners/${formattedGachaId}.webp`;

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
                alt={`${banner.id}`}
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
              {upcomingDiffInMs < 0 && diffInMs < 0 ? (
                <h2
                  className="font-mono font-bold text-green-400 text-sm px-2 py-1 border border-green-400 
              hover:animate-glitch hover:text-white hover:bg-green-400"
                >
                  LIVE
                </h2>
              ) : null}
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
              {diffInDays > 1 && <div>{diffInDays} days ago</div>}
              {diffInDays == 0 && <div>{diffInDays} day ago</div>}
              {diffInDays < 0 && <div>Ends in {diffInDays * -1} days</div>}
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
