import { useState } from "react";
import GachaCards from "../../../assets/json/cards.json";
import type { CardsTypes, CardState } from "../types";
import CardModal from "../Card_modal";

export default function FilteredCards({ selectedFilters }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(true)
  const [cardState, setCardState] = useState<CardState>({
    cardId: 0,
    rarity: 4,

    lastName: "",
    firstName: "",
    cardName: "",
    cardAttribute: "",
  });

  const formatCardName = (id: number) => String(id).padStart(4, "0");

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
    setIsLoading(true)
    setIsLoading2(true)
    setIsOpen(false);
  };











  const filteredCards = GachaCards.filter((card) => {
    if (
      selectedFilters.Character.length > 0 &&
      !selectedFilters.Character.includes(card.character)
    ) {
      return false;
    }

    if (selectedFilters.Unit && selectedFilters.Unit !== card.unit) {
      return false;
    }

    if (
      selectedFilters.Attribute.length > 0 &&
      !selectedFilters.Attribute.includes(card.attribute)
    ) {
      return false;
    }

    if (
      selectedFilters.Rarity.length > 0 &&
      !selectedFilters.Rarity.includes(card.rarity)
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="flex flex-row items-center justify-center flex-wrap gap-10">
      {filteredCards.map((card, i) => {
        const formattedCardId = formatCardName(card.id);
        const cardTrainedImg =
          card.rarity == 2
            ? `/images/card_icons/${formattedCardId}.webp`
            : `/images/card_icons/${formattedCardId}_t.webp`;

        return (
          <div key={i}>
            <button
              onClick={() => handleCardClick(card)}
              className="text-white rounded"
            >
              <img src={cardTrainedImg} style={{ width: "50px" }} />
              {card.id}
            </button>
          </div>
        );
      })}
      <CardModal isOpen={isOpen} onClose={handleCloseModal} {...cardState} isLoading={isLoading} isLoading2={isLoading2} setIsLoading={setIsLoading} setIsLoading2={setIsLoading2}/>
    </div>
  );
}
