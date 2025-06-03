import { useState } from "react";
import GachaCards from "../../assets/json/cards.json";
import LoadingComponent from "../Global/Loading";
import { useTheme } from "../../context/Theme_toggle";
import type { CardsTypes } from "./types";
export default function FilteredCards() {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [cardId, setCardId] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [rarity, setRarity] = useState(4);
  const [trainedUrl, setTrainedUrl] = useState("");
  const [untrainedUrl, setUntrainedUrl] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [cardName, setCardName] = useState("");
  const { theme } = useTheme();

  const formatCardName = (id: number) => String(id).padStart(4, "0");

  const handleCardClick = (card: CardsTypes) => {
    setCardId(card.id);
    setUntrainedUrl(`/images/cards/${card.id}_ut.webp`);
    setTrainedUrl(`/images/cards/${card.id}_t.webp`);
    setCardName(card.name);
    setCharacterName(card.character);
    setRarity(card.rarity);
    setIsOpen(true);
  };
  const handleCloseModal = () => {
    setImgLoaded(false);
    setIsOpen(false);
  };
  return (
    <div className="flex flex-row items-center justify-center flex-wrap gap-10">
      {GachaCards.map((card, i) => {
        const formattedCardId = formatCardName(card.id);
        const cardUntrainedImg = `/images/card_icons/${formattedCardId}_ut.webp`;
        const cardTrainedImg = `/images/card_icons/${formattedCardId}_t.webp`;

        return (
          <div key={i}>
            <button
              onClick={() => handleCardClick(card)}
              className=" text-white  rounded "
            >
              <img src={cardTrainedImg} style={{ width: "50px" }} />
            </button>
          </div>
        );
      })}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs text-text-light-mode">
          <div
            className={`${
              theme == "light" ? "bg-bg-light-mode2" : "bg-bg-dark-mode"
            } p-6 rounded-lg shadow-lg  w-4/5 border border-gray-300`}
          >
            {" "}
            <div
              className={`${
                theme == "light"
                  ? "text-text-light-mode"
                  : "text-text-dark-mode"
              } text-md font-semibold mb-4 tracking-[3px]`}
            >
              {characterName}
            </div>
            <h3
              className={`${
                theme == "light"
                  ? "text-text-light-mode"
                  : "text-text-dark-mode"
              } text-xl font-semibold mb-4`}
            >
              {cardName}
            </h3>
            {/* CARDS */}
            <div className="relative w-full">
              {rarity == 5 && (
                <div className="flex flex-col justify-center items-center gap-5 mb-3">
                  <img
                    src={`/images/cards/${cardId}_bd.webp`}
                    style={{
                      maxWidth: "600px",
                      height: "auto",
                    }}
                    className={`w-full transition-opacity duration-300`}
                  />
                </div>
              )}
              {(rarity == 3 || rarity == 4) && (
                <div className="flex flex-col justify-center items-center gap-5 mb-3">
                  <img
                    src={untrainedUrl}
                    style={{
                      width: "600px",
                      height: "auto",
                    }}
                    className={`w-full transition-opacity duration-300 `}
                  />
                  <img
                    src={trainedUrl}
                    style={{
                      maxWidth: "600px",
                      height: "auto",
                    }}
                    className={`w-full transition-opacity duration-300 `}
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => handleCloseModal()}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
