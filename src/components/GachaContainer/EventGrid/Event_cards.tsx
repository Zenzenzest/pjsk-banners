import { useEffect } from "react";
import AllCards from "../../../assets/json/cards.json";
import { useTheme } from "../../../context/Theme_toggle";
import type { AllCardTypes, EventCardsProps } from "../Gacha_types";
import { ImageLoader } from "../../../hooks/imageLoader";
export default function EventCards({
  bannerCards,
  bannerShopCards,
  handleCardClick,
}: EventCardsProps) {
  const { theme } = useTheme();
  const formatId = (id: number) => String(id).padStart(4, "0");
  const iconsLoader = ImageLoader(bannerShopCards.length);

  useEffect(() => {
    iconsLoader.reset();
  }, [bannerShopCards]);

  return (
    <div className="space-y-3">
      <div
        className={`grid ${
          bannerCards.length === 4
            ? "grid-cols-4 pb-1"
            : bannerCards.length <= 3
            ? "grid-cols-3 pb-1"
            : bannerCards.length > 4 && bannerShopCards.length < 1
            ? "grid-cols-4 grid-rows-2"
            : bannerCards.length > 4 && bannerShopCards.length > 0
            ? "grid-cols-4 grid-rows-2 pb-2"
            : ""
        } gap-1 }`}
      >
        {" "}
        {!iconsLoader.isLoaded && (
          <>
            {bannerShopCards.map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="animate-pulse bg-gray-300 dark:bg-gray-600 aspect-square rounded-xl"
              />
            ))}
          </>
        )}
        <div className={`${iconsLoader.isLoaded ? "contents" : "hidden"}`}>
          {bannerShopCards.map((shopCard, i) => {
            const EnEventCard = AllCards.find(
              (item: AllCardTypes) => shopCard === item.id
            );
            const formattedCardId = formatId(shopCard);
            const cardIconImage =
              EnEventCard && EnEventCard.rarity === 3
                ? `/images/card_icons/${formattedCardId}_t.webp`
                : `/images/card_icons/${formattedCardId}.webp`;

            return (
              <div
                key={`shop-${i}`}
                className="group cursor-pointer transition-transform duration-200 hover:scale-105"
                onClick={() => handleCardClick(AllCards[shopCard - 1])}
              >
                <div
                  className={`relative overflow-hidden rounded-xl ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <img
                    src={cardIconImage}
                    className="w-full h-auto transition-opacity duration-200 group-hover:opacity-80"
                    alt={`Shop Card ${shopCard}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
        {/* IF EVENT EXIST BUT NO EVENT CARD (WORLD LINK 2) */}
        {/* FOR SPACING */}
        {bannerShopCards.length < 1 &&
          bannerCards.map((card, i) => {
            const formattedCardId = formatId(card);
            const cardIconImage = `/images/card_icons/${formattedCardId}_t.webp`;
            return (
              <div
                key={i}
                className="group cursor-pointer transition-transform duration-200 hover:scale-105 invisible"
                onClick={() => handleCardClick(AllCards[card - 1])}
              >
                <div
                  className={`relative overflow-hidden rounded-xl ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <img
                    src={cardIconImage}
                    className="w-full h-auto transition-opacity duration-200 group-hover:opacity-80"
                    alt={`Card ${card}`}
                  />
                </div>
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
  );
}
