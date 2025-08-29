// import { useState } from "react";
import { useServer } from "../../../context/Server";
import { useTheme } from "../../../context/Theme_toggle";
import EnEvents from "../../../assets/json/en_events.json";
import JpEvents from "../../../assets/json/jp_events.json";
import AllCards from "../../../assets/json/cards.json";
import type { EventModalProps, SUBUNITTypes } from "./EventModalTypes";
import { ImageLoader } from "../../../hooks/imageLoader";
import { useEffect } from "react";
import { CHARACTERS, VS } from "../../../constants/common";

const SUB_UNIT: SUBUNITTypes = {
  "l/n": "Leo/Need",
  mmj: "MORE MORE JUMP!",
  vbs: "Vivid BAD SQUAD",
  wxs: "Wonderlands x Showtime",
  n25: "Nightcord at 25:00",
};

export default function EventModal({
  eventId,
  isEventOpen,
  onClose,
}: EventModalProps) {
  const { theme } = useTheme();
  const { server } = useServer();

  // Prevent parent scroll
  useEffect(() => {
    if (!isEventOpen) return;

    document.body.style.overflow = "hidden";

    // cleanup
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isEventOpen]);

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    const scrollable = target.scrollHeight > target.clientHeight;

    if (!scrollable) {
      e.preventDefault();
    }
  };

  const AllEvs = server === "jp" ? JpEvents : EnEvents;

  const EvObj = AllEvs.find((events) => events.id === eventId);
  const EvCardIds = AllCards.filter((card) =>
    EvObj?.cards.includes(card.id)
  ).map((card) => card.id);

  const EvCharacters = AllCards.filter((card) => {
    if (EvObj) {
      return EvObj.cards.includes(card.id);
    }
  }).map((card) => card.character);

  const EvAttr = AllCards.find((card) => card.id === EvCardIds[0])?.attribute;

  const hasVs = VS.some((vv) => EvCharacters.includes(vv));
  const isWorldLink = EvObj?.keywords.includes("world link");

  const filteredCards = AllCards.filter((card) => {
    const cardRelease = server === "jp" ? card.jp_released : card.en_released;
    const attrMatch = card.attribute === EvAttr;

    const charMatch = EvCharacters.includes(card.character);
    const isCardReleased =
      EvObj && EvObj.start >= cardRelease && cardRelease > 0;

    // Non world link events
    if (EvObj && !isWorldLink) {
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
    } else {
      // World link events
      const isEvCard = EvCardIds.includes(card.id);
      return isEvCard;
    }
  })
    .map((card) => {
      const tempObj = { id: 0, rarity: 0, min: 25, max: 0 }; //25 min for attr bonus
      tempObj["id"] = card.id;
      tempObj["rarity"] = card.rarity;

      if (isWorldLink) {
        tempObj["min"] += 20;
        tempObj["max"] = tempObj["min"] + 15;
        return tempObj;
      } else {
        // default vs
        if (card.unit === "Virtual Singers" && !card.sub_unit) {
          tempObj["min"] += 15;
        } else {
          // vs with sub unit or unit cards
          tempObj["min"] += 25;
        }
        // event card
        if (EvObj?.cards.includes(card.id) && card.rarity === 4) {
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
      }
    })
    .sort((a, b) => b.max - a.max)
    .sort((a, b) => b.min - a.min);

  const attrIcon = `/images/attribute_icons/${EvAttr}.webp`;
  const iconsLoader = ImageLoader(filteredCards.length);
  useEffect(() => {
    iconsLoader.reset();
  }, [eventId]);

  if (!isEventOpen) return null;
  return (
    <>
      {EvObj ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-2 sm:p-4"
          onClick={onClose}
          onTouchMove={handleTouchMove}
        >
          <div
            className={`relative w-full max-w-4xl max-h-[90vh] sm:max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border transition-all duration-300 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-600"
                : "bg-white border-gray-200"
            }`}
            onClick={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="sticky top-0 z-10 p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-inherit rounded-t-xl">
              {/* CLOSE BUTTON*/}
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

              {/* EVENT NAME*/}
              <div className="flex flex-col items-center space-y-3 mb-4">
                <div
                  className={`text-center px-4 py-2 rounded-lg max-w-full ${
                    theme === "dark"
                      ? "bg-gray-700/50 text-gray-300"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <p className="text-sm sm:text-base font-medium italic break-words">
                    {EvObj.name}
                  </p>
                </div>
              </div>

              {/* VIEW ON SEKAI BEST BUTTON */}
              <div className="flex flex-row justify-center items-center">
                {" "}
                <a
                  href={`https://sekai.best/event/${eventId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    theme === "dark"
                      ? "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20"
                      : "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
                  }`}
                >
                  <span>View on Sekai Best</span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
            {/* EVENT ATTRIBUTE*/}
            {!isWorldLink && (
              <div className="flex flex-col sm:flex-row justify-center sm:justify-start gap-2 sm:gap-3 items-center p-6 rounded-lg bg-opacity-50  ">
                <h3
                  className={`text-base sm:text-lg font-semibold text-center sm:text-left ${
                    theme === "dark" ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  Attribute Bonus +25%
                </h3>
                <img
                  src={attrIcon}
                  alt="attr"
                  className="w-8 h-8 sm:w-10 sm:h-10"
                />
              </div>
            )}
            <div className="p-4 pt-0 sm:p-6 space-y-6">
              {/* EVENT CHARACTERS */}
              <div className="space-y-3">
                <h3
                  className={`text-base sm:text-lg font-semibold text-center sm:text-left ${
                    theme === "dark" ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  Character Bonus +25%
                </h3>
                <div
                  className={`flex flex-wrap gap-2  justify-center sm:justify-start items-center`}
                >
                  {EvCharacters.map((char) => {
                    const charIcon = `/images/character_icons/${
                      CHARACTERS.indexOf(char) + 1
                    }.webp`;
                    return (
                      <div key={char} className="flex flex-col items-center">
                        <img
                          src={charIcon}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-sm"
                          alt={char}
                        />
                      </div>
                    );
                  })}
                  {hasVs &&
                    VS.map((vs) => {
                      const charIcon = `/images/character_icons/${
                        CHARACTERS.indexOf(vs) + 1
                      }.webp`;

                      if (EvCharacters.includes(vs)) {
                        return null;
                      } else {
                        return (
                          <div key={vs} className="flex flex-col items-center">
                            <img
                              src={charIcon}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-sm "
                              alt={vs}
                            />
                          </div>
                        );
                      }
                    })}
                </div>
              </div>

              {/* BONUS CARDS */}
              <div className="space-y-4">
                <h3
                  className={`text-base sm:text-lg font-semibold text-center sm:text-left ${
                    theme === "dark" ? "text-gray-300" : "text-gray-800"
                  } `}
                >
                  Bonus Cards
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4">
                  {!iconsLoader.isLoaded && (
                    <>
                      {filteredCards.map((_, i) => (
                        <div
                          key={`skeleton-${i}`}
                          className="animate-pulse bg-gray-300 dark:bg-gray-600 aspect-square rounded-xl"
                        />
                      ))}
                    </>
                  )}
                  <div
                    className={`${
                      iconsLoader.isLoaded ? "contents" : "hidden"
                    }`}
                  >
                    {" "}
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
                          className="group cursor-pointer transition-transform duration-200 hover:scale-105 flex flex-col items-center space-y-2"
                        >
                          <a
                            href={`https://sekai.best/${card.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center space-y-2 w-full"
                          >
                            <div className="relative overflow-hidden rounded-lg shadow-md">
                              <img
                                src={`/images/card_icons/${cardName}`}
                                className="w-full h-auto transition-opacity duration-200 group-hover:opacity-80"
                                alt={`Card ${card.id}`}
                                onLoad={iconsLoader.handleLoad}
                              />
                            </div>

                            {/* PERCENTAGE*/}
                            <div
                              className={`w-full px-2 py-1 rounded-md text-center ${
                                theme === "dark"
                                  ? "bg-gray-700/80 text-gray-200"
                                  : "bg-gray-100/80 text-gray-700"
                              }`}
                            >
                              <div className="text-xs sm:text-sm font-medium">
                                {card.min}% - {card.max}%
                              </div>
                            </div>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>{" "}
            <div
              className={`sticky bottom-0 z-10 text-xs px-5 sm:text-sm lg:text-lg ${
                theme === "dark" ? "bg-[#101828]" : "bg-[#d1d5dc]"
              }  flex flex-row justify-between gap-2 items-center px-1 py-4`}
            >
              {" "}
              <a
                href={`https://sekai.best/storyreader/eventStory/${eventId}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center space-x-2 px-1 py-2 rounded-lg font-medium transition-all duration-200 ${
                  theme === "dark"
                    ? "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20"
                    : "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
                }`}
              >
                <span>Event Story</span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 "
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
              <button
                onClick={onClose}
                className={`inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg  font-medium transition-all duration-200 ${
                  theme === "dark"
                    ? "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20"
                    : "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
