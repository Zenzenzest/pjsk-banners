import { useEffect } from "react";

import { useTheme } from "../../../context/Theme_toggle";
import type { EventCardsProps } from "../BannerTypes";
import { ImageLoader } from "../../../hooks/imageLoader";
import CardIcon from "../../Icons/Icon";
import { useProsekaData } from "../../../context/Data";

export default function EventCards({
  bannerCards,
  bannerShopCards,
  handleCardClick,
}: EventCardsProps) {
  const { theme } = useTheme();
  const { allCards } = useProsekaData();
  const iconsLoader = ImageLoader(bannerShopCards.length);

  useEffect(() => {
    iconsLoader.reset();
  }, [bannerCards]);

  return (
    <div className="space-y-3">
      <div
        className={`grid ${
          bannerCards.length === 4 && bannerShopCards.length >= 1
            ? "grid-cols-3 sm:grid-cols-4 grid-rows-2 sm:grid-rows-1 pb-2 sm:pb-1"
            : bannerCards.length <= 3
            ? "grid-cols-3 pb-1"
            : bannerCards.length >= 5 && bannerShopCards.length < 1
            ? "grid-cols-3 sm:grid-cols-4 grid-rows-2 "
            : bannerCards.length === 4 && bannerShopCards.length < 1
            ? "grid-cols-3 sm:grid-cols-4 grid-rows-1 "
            : bannerCards.length > 4 && bannerShopCards.length > 0
            ? "grid-cols-3 sm:grid-cols-4 grid-rows-2 pb-2"
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
            const EnEventCard = allCards.find((item) => shopCard === item.id);

            const cardIconImage =
              EnEventCard && EnEventCard.rarity === 3
                ? `/images/card_icons/${shopCard}_t.webp`
                : `/images/card_icons/${shopCard}.webp`;

            return (
              <div
                key={`shop-${i}`}
                className="group cursor-pointer transition-transform duration-200 hover:scale-105"
                onClick={() => {
                  if (EnEventCard) {
                    handleCardClick(EnEventCard.id);
                  }
                }}
              >
                <CardIcon
                  imgUrl={cardIconImage}
                  iconsLoader={iconsLoader}
                  cardId={shopCard}
                />
              </div>
            );
          })}
        </div>
        {/* IF EVENT EXIST BUT NO EVENT CARD (WORLD LINK 2) */}
        {/* FOR SPACING */}
        {bannerShopCards.length < 1 &&
          bannerCards.map((card, i) => {
            const cardIconImage = `/images/card_icons/${card}_t.webp`;
            return (
              <div
                key={i}
                className="group cursor-pointer transition-transform duration-200 hover:scale-105 invisible"
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
