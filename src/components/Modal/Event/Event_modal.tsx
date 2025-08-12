// import { useState } from "react";
import { useServer } from "../../../context/Server";
import { useTheme } from "../../../context/Theme_toggle";
import EnEvents from "../../../assets/json/en_events.json";
import JpEvents from "../../../assets/json/jp_events.json";

import EventBonus from "../../../assets/json/event_bonus.json";
import AllCards from "../../../assets/json/cards.json";
import type { EventModalProps, SUBUNITTypes } from "./EventModalTypes";

const SUB_UNIT: SUBUNITTypes = {
  "l/n": "Leo/Need",
  mmj: "MORE MORE JUMP!",
  vbs: "Vivid BAD SQUAD",
  wxs: "Wonderlands x Showtime",
  n25: "Nightcord at 25:00",
};
const VS = [
  "Hatsune Miku",
  "Kagamine Rin",
  "Kagamine Len",
  "Megurine Luka",
  "MEIKO",
  "KAITO",
];

export default function EventModal({
  eventId,
  isEventOpen,
  onClose,
}: EventModalProps) {
  const { theme } = useTheme();
  const { server } = useServer();
  // const [isLoading, setIsLoading] = useState(true);

  if (!isEventOpen) return null;

  const AllEvs = server === "jp" ? JpEvents : EnEvents;

  const EvObj = AllEvs.find((events) => events.id === eventId);

  const EvCards = AllCards.filter((card) => EvObj?.cards.includes(card.id));

  const characters = AllCards.filter((card) => {
    if (EvObj) {
      return EvObj.cards.includes(card.id);
    }
  }).map((card) => card.character);

  const EvAttr = EventBonus.filter((ev) => ev.eventId === eventId).map(
    (ev) => ev.cardAttr
  )[0];

  const filteredCards = AllCards.filter((card) => {
    if (EvObj && !EvObj.keywords.includes("world link")) {
      const cardRelease = server === "jp" ? card.jp_released : card.en_released;
      const attrMatch = card.attribute.toLowerCase() === EvAttr;

      const charMatch = characters.includes(card.character);
      const isCardReleased = EvObj.start >= cardRelease;

      const hasVs = VS.some((vv) => characters.includes(vv));
      if (hasVs) {
        const vsDefault = card.unit === "Virtual Singers" && !card.sub_unit;
        const subUnitMatch =
          card.sub_unit && card.sub_unit === SUB_UNIT[EvObj.unit];
        const isVs = card.unit === "Virtual Singers";
        return (
          attrMatch &&
          isCardReleased &&
          (vsDefault || subUnitMatch || (charMatch && !isVs))
        );
      } else {
        return attrMatch && charMatch && isCardReleased;
      }
    }
  })
    .map((card) => {
      const tempObj = { id: 0, rarity: 0, min: 25, max: 0 }; //25 min for attr bonus
      tempObj["id"] = card.id;
      tempObj["rarity"] = card.rarity;

      // default vs
      if (card.unit === "Virtual Singers" && !card.sub_unit) {
        tempObj["min"] += 15;
      } else {
        // vs with sub unit or unit cards
        tempObj["min"] += 25;
      }
      // event card
      if (EvObj?.cards.includes(card.id)) {
        tempObj["min"] += 20;
      }

      switch (card.rarity) {
        case 4:
          // +15 max for 4*
          tempObj["max"] = tempObj["min"] + 15;
          break;
        case 5:
          tempObj["max"] = tempObj["min"] + 10;
          break;
        case 3:
          tempObj["max"] = tempObj["min"] + 5;
          break;
        case 2:
          tempObj["max"] = tempObj["min"] + 1;
          break;
        case 1:
          tempObj["max"] = tempObj["min"] + 0.5;
      }

      return tempObj;
    })
    .sort((a, b) => b.max - a.max)
    .sort((a, b) => b.min - a.min);
  return (
    <>
      {EvObj ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <div
            className={`relative max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border transition-all duration-300 ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
            onClick={(e) => e.stopPropagation()} //prevent closing the modal when clicking on it
          >
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              {/* CLOSE BUTTON */}
              <button
                onClick={onClose}
                className={`absolute top-3 right-3 z-20 p-2 rounded-full transition-colors ${
                  theme === "dark"
                    ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                    : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="flex flex-col items-center space-y-2">
                {/* EVENT NAME*/}
                <div
                  className={`text-center px-3 py-1 rounded-lg ${
                    theme === "dark"
                      ? "bg-gray-700/50 text-gray-300"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <p className="text-sm font-medium italic">{EvObj.name}</p>
                </div>{" "}
                <span
                  className="
      px-1.5 py-0.5 rounded-full text-[10px] bg-gray-700 text-gray-300
    "
                ></span>
              </div>

              {/* EVENT CARDS */}
              <div className="flex flex-col justify-center items-center">
                <span>Event Cards</span>
                <div className="grid grid-cols-5 gap-2">
                  {EvCards.map((card) => {
                    let cardName = "";
                    if (card.rarity === 2) {
                      cardName = `${card.id}.webp`;
                    } else {
                      cardName = `${card.id}_ut.webp`;
                    }
                    return (
                      <div
                        key={card.id}
                        className="group cursor-pointer transition-transform duration-200 hover:scale-105"
                      >
                        <img
                          src={`/images/card_icons/${cardName}`}
                          className="transition-opacity duration-200 group-hover:opacity-80"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* EVENT BONUS CARDS */}
              <div>
                {" "}
                <span>Bonus Cards</span>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-5">
                  {filteredCards.map((card) => {
                    let cardName = "";
                    if (card.rarity === 2 || card.rarity === 1) {
                      cardName = `${card.id}.webp`;
                    } else if (card.rarity === 5) {
                      cardName = `${card.id}_t.webp`;
                    } else {
                      cardName = `${card.id}_ut.webp`;
                    }
                    return (
                      <div
                        key={card.id}
                        className="group cursor-pointer transition-transform duration-200 hover:scale-105 flex flex-col"
                      >
                        <a
                          href={`https://sekai.best/${card.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {" "}
                          <img
                            src={`/images/card_icons/${cardName}`}
                            className="transition-opacity duration-200 group-hover:opacity-80"
                            alt={`${card.id}`}
                          />
                        </a>
                        <div
                          className={`w-[4/5] flex flex-row items-center justify-center gap-3 text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-800"
                          } `}
                        >
                          <span> {card.min}% </span>
                          <span>-</span>
                          <span> {card.max}% </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
