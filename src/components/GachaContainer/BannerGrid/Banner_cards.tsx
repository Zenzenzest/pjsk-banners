import { useState } from "react";
import { useTheme } from "../../../context/Theme_toggle";
import AllCards from "../../../assets/json/cards.json";
import type { CardsProps } from "../Gacha_types";
import CardSkeleton from "../Skeletons/Cards_skeleton";

export default function Cards({ banner, handleCardClick }: CardsProps) {
  const { theme } = useTheme();
  const [loadingStates, setLoadingStates] = useState<{
    [key: number]: boolean;
  }>({});

  const formatId = (id: number) => String(id).padStart(4, "0");

  const handleImageLoad = (index: number) => {
    setLoadingStates((prev) => ({ ...prev, [index]: false }));
  };

  const handleImageError = (index: number) => {
    setLoadingStates((prev) => ({ ...prev, [index]: false }));
  };

  return (
    <div className="space-y-3">
      <div
        className={`grid ${
          !banner.event_id
            ? "grid-cols-4"
            : banner.cards.length > 3 && banner.event_id
            ? "grid-cols-4"
            : "grid-cols-3"
        } gap-1`}
      >
        {banner.cards.map((card, i) => {
          const formattedCardId = formatId(card);
          const cardIconImage = `/images/card_icons/${formattedCardId}_t.webp`;
          const isLoading = loadingStates[i] !== false;

          return (
            <div
              key={i}
              className="group cursor-pointer transition-transform duration-200 hover:scale-105"
              onClick={() => handleCardClick(AllCards[card - 1])}
            >
              <div className="relative">
                {isLoading && <CardSkeleton />}
                <div
                  className={`relative overflow-hidden rounded-xl transition-opacity duration-200 ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                  } ${
                    isLoading ? "absolute inset-0 opacity-0" : "opacity-100"
                  }`}
                >
                  <img
                    src={cardIconImage}
                    className="w-full h-auto transition-opacity duration-200 group-hover:opacity-80"
                    alt={`Card ${card}`}
                    onLoad={() => handleImageLoad(i)}
                    onError={() => handleImageError(i)}
                  />
                </div>
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
