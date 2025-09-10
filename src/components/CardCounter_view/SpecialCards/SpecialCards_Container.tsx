import AllCards from "../../../assets/json/cards.json";
import type { AllCardTypes } from "../../../types/common";
import { CHARACTERS } from "../../../constants/common";
import { useServer } from "../../../context/Server";
import WebsiteDisclaimer from "../../Nav/Website_disclaimer";
import type { GroupedCards } from "./SpecialCardsTypes";
import { useTheme } from "../../../context/Theme_toggle";
import { useState } from "react";
import { today } from "../../../constants/common";
import CardModal from "../../Modal/Card/Card_modal";

const COLLAB_TAGS = [
  { tag: "Deadly Sins", label: "Deadly Sins", key: "deadly_sins" },
  { tag: "Sanrio", label: "Sanrio", key: "sanrio" },
  { tag: "Ensemble", label: "Ensemble Stars!!", key: "ensemble" },
  { tag: "Touhou", label: "Touhou", key: "touhou", jpOnly: true },
];

export default function SpecialCards() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(true);
  const [cardId, setCardId] = useState(0);
  const { server } = useServer();
  const { theme } = useTheme();

  const handleCardClick = (cardId: number) => {
    setCardId(cardId);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsLoading(true);
    setIsLoading2(true);
    setIsOpen(false);
  };

  const filteredCards = AllCards.filter((card: AllCardTypes) => {
    const releaseTime = server === "jp" ? card.jp_released : card.en_released;
    return releaseTime && today >= releaseTime;
  });

  const groupedCards: GroupedCards = {};

  CHARACTERS.forEach((character) => {
    groupedCards[character] = {
      bloom_fes: [],
      color_fes: [],
      unit_limited: [],
      bday: [],
      movie_exclusive: [],
    };

    //  add collab keys
    COLLAB_TAGS.forEach((collab) => {
      if (!collab.jpOnly || server === "jp") {
        groupedCards[character][collab.key] = [];
      }
    });
  });

  filteredCards.forEach((card: AllCardTypes) => {
    // Initialize character if not exists
    if (!groupedCards[card.character]) {
      groupedCards[card.character] = {
        bloom_fes: [],
        color_fes: [],
        unit_limited: [],
        bday: [],
        movie_exclusive: [],
      };

      COLLAB_TAGS.forEach((collab) => {
        if (!collab.jpOnly || server === "jp") {
          groupedCards[card.character][collab.key] = [];
        }
      });
    }

    switch (card.card_type) {
      case "bloom_fes":
        groupedCards[card.character].bloom_fes.push(card);
        break;
      case "color_fes":
        groupedCards[card.character].color_fes.push(card);
        break;
      case "unit_limited":
        groupedCards[card.character].unit_limited.push(card);
        break;
      case "bday":
        groupedCards[card.character].bday.push(card);
        break;
      case "movie_exclusive":
        groupedCards[card.character].movie_exclusive.push(card);
        break;
    }

    if (card.card_type === "limited_collab" && card.collab_tag) {
      const collab = COLLAB_TAGS.find((c) => c.tag === card.collab_tag);
      if (collab && (!collab.jpOnly || server === "jp")) {
        groupedCards[card.character][collab.key].push(card);
      }
    }
  });

  const charactersWithCards = CHARACTERS.filter((character) => {
    const charCards = groupedCards[character];
    return Object.values(charCards).some((cards) => cards.length > 0);
  });

  const renderCardIcons = (cards: AllCardTypes[]) => {
    if (cards.length === 0) {
      return (
        <div className="flex justify-center">
          <span
            className={`${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            } text-sm`}
          >
            N/A
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center space-x-1 min-h-[60px] whitespace-nowrap">
        {cards.map((card, index) => {
          let cardIcon = "";
          if (card.rarity === 4 || card.rarity === 5) {
            cardIcon = `/images/card_icons/${card.id}_t.webp`;
          } else {
            cardIcon = `/images/card_icons/${card.id}.webp`;
          }
          return (
            <img
              key={`${card.id}-${index}`}
              src={cardIcon}
              alt={card.name}
              className="w-11 h-11 lg:w-16 lg:h-16 object-contain rounded flex-shrink-0 cursor-pointer transition-transform hover:scale-105 duration-200"
              loading="lazy"
              onClick={() => handleCardClick(Number(card.id))}
            />
          );
        })}
      </div>
    );
  };

  // collab columns
  const collabColumns = COLLAB_TAGS.filter(
    (collab) => !collab.jpOnly || server === "jp"
  ).map((collab) => ({
    key: collab.key,
    label: collab.label,
    color: getCollabColor(collab.key),
  }));

  function getCollabColor(key: string): string {
    const colorMap: Record<string, string> = {
      deadly_sins:
        theme === "dark" ? "bg-yellow-900/30" : "bg-yellow-100 text-gray-700",
      sanrio: theme === "dark" ? "bg-pink-500/70" : "bg-pink-100 text-gray-700",
      ensemble:
        theme === "dark" ? "bg-indigo-900/30" : "bg-indigo-100 text-gray-700",
      touhou: theme === "dark" ? "bg-red-900/30" : "bg-red-100 text-gray-700",
    };

    const defaultLight = "bg-gray-100";
    const defaultDark = "bg-gray-800/50";

    return colorMap[key] || (theme === "dark" ? defaultDark : defaultLight);
  }

  const getThemeColor = (lightColor: string, darkColor: string) =>
    theme === "dark" ? darkColor : lightColor;

  return (
    <div
      className={`p-4 border rounded-lg ${
        theme === "dark"
          ? "border-gray-700 bg-[#101828]"
          : "border-gray-200 bg-[#f9fafb]"
      }`}
    >
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 ">
        <table
          className={`min-w-full ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* COLUMN HEADERS */}
          <thead className="sticky top-0 z-20">
            <tr className={getThemeColor("bg-gray-50", "bg-gray-700")}>
              <th
                className={`px-4 py-1 text-left text-xs font-medium uppercase tracking-wider sticky left-0 z-10 ${
                  theme === "dark"
                    ? "text-gray-300 bg-gray-700"
                    : "text-gray-500 bg-gray-50"
                }`}
              >
                Character
              </th>
              <th
                colSpan={2}
                className={`px-4 py-1 text-center text-xs font-medium uppercase tracking-wider ${
                  theme === "dark"
                    ? "text-blue-400 bg-blue-900/30"
                    : "text-blue-600 bg-blue-50"
                }`}
              >
                Festival
              </th>
              <th
                className={`px-4 py-1 text-center text-xs font-medium uppercase tracking-wider ${
                  theme === "dark"
                    ? "text-gray-800 bg-[#a8ecfb]/80"
                    : "text-purple-600 bg-[#a8ecfb]/80"
                }`}
              >
                World Link
              </th>
              <th
                className={`px-4 py-1 text-center text-xs font-medium uppercase tracking-wider ${
                  theme === "dark"
                    ? "text-green-400 bg-green-900/30"
                    : "text-green-600 bg-green-50"
                }`}
              >
                Birthday
              </th>

              <th
                className={`px-4 py-1 text-center text-xs font-medium uppercase tracking-wider ${
                  theme === "dark"
                    ? "text-purple-400 bg-purple-900/30"
                    : "text-purple-600 bg-purple-50"
                }`}
              >
                Movie
              </th>
              <th
                colSpan={collabColumns.length}
                className={`px-4 py-1 text-center text-xs font-medium uppercase tracking-wider ${
                  theme === "dark"
                    ? "text-orange-400 bg-orange-900/30"
                    : "text-orange-600 bg-orange-50"
                }`}
              >
                Collabs
              </th>
            </tr>
            <tr className={getThemeColor("bg-gray-100", "bg-gray-600")}>
              <th
                className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider sticky left-0 z-10 ${
                  theme === "dark"
                    ? "text-gray-300 bg-gray-600"
                    : "text-gray-500 bg-gray-100"
                }`}
              >
                Name
              </th>
              <th
                className={`px-4 py-2 text-center text-xs font-medium uppercase tracking-wider ${
                  theme === "dark"
                    ? "text-gray-300 bg-blue-800/50"
                    : "text-gray-500 bg-blue-100"
                }`}
              >
                Bloom Fes
              </th>
              <th
                className={`px-4 py-2 text-center text-xs font-medium uppercase tracking-wider ${
                  theme === "dark"
                    ? "text-gray-300 bg-blue-800/50"
                    : "text-gray-500 bg-blue-100"
                }`}
              >
                Color Fes
              </th>{" "}
              <th
                className={`px-4 py-2 text-center text-xs font-medium uppercase tracking-wider ${
                  theme === "dark"
                    ? "text-gray-300 bg-cyan-600/80"
                    : "text-gray-500 bg-cyan-100"
                }`}
              >
                World Link
              </th>
              <th
                className={`px-4 py-2 text-center text-xs font-medium uppercase tracking-wider ${
                  theme === "dark"
                    ? "text-gray-300 bg-green-800/50"
                    : "text-gray-500 bg-green-100"
                }`}
              >
                Birthday
              </th>
              <th
                className={`px-4 py-2 text-center text-xs font-medium uppercase tracking-wider ${
                  theme === "dark"
                    ? "text-gray-300 bg-purple-800/50"
                    : "text-gray-500 bg-purple-100"
                }`}
              >
                Movie
              </th>
              {collabColumns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-2 text-center text-xs font-medium uppercase tracking-wider ${column.color}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody
            className={
              theme === "dark"
                ? "divide-y divide-gray-700"
                : "divide-y divide-gray-200"
            }
          >
            {charactersWithCards.map((character) => {
              const charCards = groupedCards[character];
              return (
                <tr
                  key={character}
                  className={
                    theme === "dark"
                      ? "hover:bg-gray-700/50 transition-colors"
                      : "hover:bg-gray-50 transition-colors"
                  }
                >
                  <td
                    className={`px-4 py-1 whitespace-nowrap text-sm font-medium sticky left-0 z-10 ${
                      theme === "dark"
                        ? "text-white bg-gray-800"
                        : "text-gray-900 bg-white"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <img
                        src={`/images/character_icons/${
                          CHARACTERS.indexOf(character) + 1
                        }.webp`}
                        alt={character}
                        className="w-10 h-10 lg:w-13 lg:h-13 object-contain"
                        loading="lazy"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap">
                    {renderCardIcons(charCards.bloom_fes)}
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap">
                    {renderCardIcons(charCards.color_fes)}
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap min-w-[130px]">
                    {renderCardIcons(charCards.unit_limited)}
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap min-w-[240px]">
                    {renderCardIcons(charCards.bday)}
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap">
                    {renderCardIcons(charCards.movie_exclusive)}
                  </td>
                  {collabColumns.map((column) => (
                    <td
                      key={column.key}
                      className="px-4 py-1 whitespace-nowrap"
                    >
                      {renderCardIcons(
                        charCards[column.key as keyof typeof charCards] || []
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <WebsiteDisclaimer />
      <CardModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        cardId={cardId}
        isLoading={isLoading}
        isLoading2={isLoading2}
        setIsLoading={setIsLoading}
        setIsLoading2={setIsLoading2}
      />
    </div>
  );
}
