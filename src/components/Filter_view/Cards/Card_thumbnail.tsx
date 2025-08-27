import type { CardThumbnailProps } from "../FilterTabTypes";
import type { AllCardTypes } from "../../../types/common";
import CardGrid from "./Card_grid";
import { SpecialCards } from "../../../constants/common";
export default function CardThumbnail({ card  }:CardThumbnailProps) {



    // Helper function to render star icons
  const renderStarIcons = (rarity: number, cardId: number, position: "top-right" | "top-left" = "top-right") => {
    const isSpecialCard = SpecialCards.includes(cardId)
    const iconSrc = `images/rarity_icons/${
      (isSpecialCard || rarity <= 2) ? "un" : ""
    }trained_star.png`;

    const positionClasses = {
      "top-right": "absolute top-0 right-1",
      "top-left": "absolute top-0 left-1",
    };

    return (
      <div className={positionClasses[position]}>
        {Array(rarity)
          .fill(0)
          .map((_, i) => (
            <img
              key={i}
              src={iconSrc}
              alt={`Star ${i + 1}`}
              className="w-[15px] inline-block"
            />
          ))}
      </div>
    );
  };

  // Main card rendering logic
  const renderCardByRarity = (card:AllCardTypes) => {
    const cardConfig = {
      high: {
        // rarity 3-4
        mode: "t",
        condition: card.rarity >= 3 && card.rarity <= 4,
        overlay: () => renderStarIcons(card.rarity, card.id, "top-right"),
      },
      birthday: {
        // rarity 5
        mode: "bd",
        condition: card.rarity === 5,
        overlay: () => (
          <img
            src="/images/rarity_icons/bday.png"
            alt="Birthday card"
            className="absolute bottom-1 left-1 w-6"
          />
        ),
      },
      low: {
        // rarity 1-2
        mode: "u",
        condition: card.rarity <= 2,
        overlay: () => renderStarIcons(card.rarity, card.id, "top-left"),
      },
    };

    // Find matching configuration
    const config = Object.values(cardConfig).find((cfg) => cfg.condition);

    if (!config) return null;

    return (
      <div className="relative">
        <CardGrid mode={config.mode} cardId={card.id} cardName={card.name} />
        {config.overlay()}
      </div>
    );
  };

  return <>{renderCardByRarity(card)}</>;
}
