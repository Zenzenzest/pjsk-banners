import { useState } from "react";
import GachaCards from "../../assets/json/cards.json";
import LoadingComponent from "../Global/Loading";
import { useTheme } from "../../context/Theme_toggle";
import type { CardsTypes } from "./types";

export default function FilteredCards({ selectedFilters }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [cardId, setCardId] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [rarity, setRarity] = useState(4);
  const [trainedUrl, setTrainedUrl] = useState("");
  const [untrainedUrl, setUntrainedUrl] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardAttribute, setCardAttribute] = useState("");
  const { theme } = useTheme();

  const formatCardName = (id: number) => String(id).padStart(4, "0");

  const handleCardClick = (card: CardsTypes) => {
    setCardId(card.id);
    setUntrainedUrl(`/images/cards/${card.id}_ut.webp`);
    setTrainedUrl(`/images/cards/${card.id}_t.webp`);
    setCardName(card.name);
    const [lName, fName] = card.character.split(" ");
    setLastName(lName);
    setFirstName(fName);
    setRarity(card.rarity);
    setCardAttribute(card.attribute);
    setIsOpen(true);
  };
  const filteredCards = GachaCards.filter((card) => {
    // CHARACTER FILTER
    if (
      selectedFilters.Character.length > 0 &&
      !selectedFilters.Character.includes(card.character)
    ) {
      return false;
    }

    //  UNIT FILTER
    if (selectedFilters.Unit && selectedFilters.Unit !== card.unit) {
      return false;
    }

    // ATTRIBUTE FILTER
    if (
      selectedFilters.Attribute.length > 0 &&
      !selectedFilters.Attribute.includes(card.attribute)
    ) {
      return false;
    }

    // RARITY FILTER
    if (
      selectedFilters.Rarity.length > 0 &&
      !selectedFilters.Rarity.includes(card.rarity)
    ) {
      return false;
    }

    return true;
  });

  const handleCloseModal = () => {
    setImgLoaded(false);
    setIsOpen(false);
  };
  return (
    <div className="flex flex-row items-center justify-center flex-wrap gap-10">
      {filteredCards.map((card, i) => {
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
            } p-6 rounded-lg shadow-lg border border-gray-300`}
          >
            <div
              className={`flex flex-row justify-center items-center gap-3 ${
                theme == "light"
                  ? "text-text-light-mode"
                  : "text-text-dark-mode"
              } text-md font-semibold mb-4 tracking-[3px]`}
            >
              {/* CARD ATTRIBUTE */}
              <div>
                <img
                  src={`/images/attribute_icons/${cardAttribute}.webp`}
                  style={{
                    width: "2rem",
                  }}
                />
              </div>{" "}
              {/* CHARACTER NAME */}
              <div className="text-3xl font-bold  font-serif tracking-wide">
                {lastName} {firstName}
              </div>
            </div>

            {/* CARDS */}
            <div className="relative ">
              {rarity == 5 && (
                <div className="flex flex-col justify-center items-center gap-5 mb-3 relative">
                  <img
                    src={`/images/cards/${cardId}_bd.webp`}
                    style={{
                      maxWidth: "500px",
                      height: "auto",
                    }}
                    className={`w-full transition-opacity duration-300`}
                  />
                  {/* CARD NAME */}
                  <div className="w-full text-sm italic rounded-md backdrop-blur-sm absolute top-0 right-0 text-center  text-mizuki [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">
                    {cardName}
                  </div>

                  {/* RARITY ICON */}
                  <img
                    src="/images/rarity_icons/bday.png"
                    style={{
                      position: "absolute",
                      bottom: 5,
                      left: 5,
                      width: "2rem",
                    }}
                  />
                </div>
              )}
              {(rarity == 3 || rarity == 4) && (
                <div className="flex flex-col justify-center items-center gap-5 mb-3">
                  <div className="relative">
                    <img
                      src={untrainedUrl}
                      style={{
                        width: "500px",
                        height: "auto",
                        marginBottom: "10px",
                      }}
                      className={`w-full transition-opacity duration-300 `}
                    />
                    <div className="absolute top-1 left-1">
                      {Array(rarity)
                        .fill(0)
                        .map((_, i) => {
                          return (
                            <img
                              key={i}
                              src="/images/rarity_icons/untrained_star.png"
                              style={{ width: "30px", display: "inline-block" }}
                            />
                          );
                        })}
                    </div>{" "}
                  </div>{" "}
                  <div className="relative">
                    <img
                      src={trainedUrl}
                      style={{
                        maxWidth: "500px",
                        height: "auto",
                      }}
                      className={`w-full transition-opacity duration-300 `}
                    />{" "}
                    <div className="w-full text-lg italic rounded-md backdrop-blur-sm absolute top-0 right-0 text-center  text-mizuki [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">
                      {cardName}
                    </div>
                    <div className="absolute bottom-1 right-1">
                      {Array(rarity)
                        .fill(0)
                        .map((_, i) => {
                          return (
                            <img
                              key={i}
                              src="/images/rarity_icons/trained_star.png"
                              style={{
                                width: "30px",
                                display: "inline-block",
                              }}
                            />
                          );
                        })}
                    </div>
                  </div>
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
