import { useEffect } from "react";
import { useTheme } from "../../../context/Theme_toggle";
import AllCards from "../../../assets/json/cards.json";
import type { CardsProps } from "../BannerTypes";
import { ImageLoader } from "../../../hooks/imageLoader";
import CardIcon from "../../Icons/Icon";


export default function Cards({ banner, handleCardClick }: CardsProps) {
  const { theme } = useTheme();

  const iconsLoader = ImageLoader(banner.cards.length);

  useEffect(() => {
    iconsLoader.reset();
  }, [banner.cards]);

  return (
    <div className="space-y-3">
      <div
        className={`grid ${
          !banner.event_id
            ? "grid-cols-4"
            : banner.cards.length > 3 && banner.event_id
            ? "grid-cols-3 sm:grid-cols-4"
            : "grid-cols-3"
        } gap-1`}
      >
        {!iconsLoader.isLoaded && (
          <>
            {banner.cards.map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="animate-pulse bg-gray-300 dark:bg-gray-600 aspect-square rounded-xl"
              />
            ))}
          </>
        )}
        <div className={`${iconsLoader.isLoaded ? "contents" : "hidden"}`}>
          {banner.cards.map((card, i) => {
            const cardData = AllCards.find((item) => item.id === card);

            let cardIconImage = "";
            if (cardData?.rarity === 5) {
              cardIconImage = `/images/card_icons/${card}_t.webp`;
            } else {
              cardIconImage = `/images/card_icons/${card}_t.webp`;
            }
            return (
              <div
                key={i}
                className="group cursor-pointer will-change-transform"
                onClick={() => {
                  if (cardData) {
          
                    handleCardClick(cardData.id);

                  }
                }}
                style={{
                  transition: "transform 0.2s ease-out",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <CardIcon
                  imgUrl={cardIconImage}
                  cardId={card}
                  iconsLoader={iconsLoader}
                />

                <p
                  className={`text-xs text-center mt-1 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                ></p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
