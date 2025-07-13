import { useTheme } from "../../../context/Theme_toggle";
import AllCards from "../../../assets/json/cards.json" with { type: "json" };
import type { CardsProps } from "../Gacha_types";

export default function Cards({ banner, handleCardClick }: CardsProps) {
  const { theme } = useTheme();
  const formatId = (id: number) => String(id).padStart(4, "0");

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

          return (
            <div
              key={i}
              className="group cursor-pointer transition-transform duration-200 hover:scale-105"
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
