import { AllCharacters } from "../../Counter_constants";

import type { TableRowProps } from "../CounterTableTypes";

export default function TableRow({
  character,
  getRarityBarColor,
  getMaxCountForCategory,
  handleCardClick,
}: TableRowProps) {
  const cardBreakdownColumns = character.sortedCardBreakdown.map(
    (card, index) => {
      const maxCount = getMaxCountForCategory(card.rarity, card.isLimited);
      const percentage = (card.count / maxCount) * 100;

      return (
        <td
          key={index}
          className="px-4 py-3 whitespace-nowrap text-sm text-center"
        >
          <div className="flex items-center justify-center space-x-2">
            <div className="w-10 lg:w-13 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getRarityBarColor(
                  card.rarity,
                  card.isLimited
                )}`}
                style={{
                  width: `${Math.min(100, percentage)}%`,
                }}
              ></div>
            </div>
            <span className="font-medium w-6 text-center">{card.count}</span>
          </div>
        </td>
      );
    }
  );

  const lastCardsColumns = character.lastCards.map((card, index) => {
    const isCardData = Array.isArray(card) && card.length >= 3;

    const cardId = isCardData ? card[1] : 0;
    const cardRarity = isCardData ? card[2] : 0;
    const dateText = isCardData ? card[0] : card;

    const iconSrc =
      cardRarity === 2
        ? `/images/card_icons/${cardId}.webp`
        : `/images/card_icons/${cardId}_t.webp`;

    return (
      <td
        key={index}
        className="px-1 py-1 whitespace-nowrap text-xs min-w-[150px] text-center text-gray-500 dark:text-gray-400"
      >
        <div className="flex items-center justify-center space-x-1">
          <span className="min-w-[90px]">{dateText}</span>
          {isCardData && Number(cardId) > 0 && (
            <img
              src={iconSrc}
              alt={`Card ${cardId}`}
              className="w-10 h-10 lg:w-13 lg:h-13 transition-transform hover:scale-105 duration-200 hover:opacity-80 cursor-pointer rounded-lg"
              loading="lazy"
              onClick={() => handleCardClick(Number(cardId))}
            />
          )}
        </div>
      </td>
    );
  });
  const charIndex = AllCharacters.indexOf(character.name) + 1;
  let unitIcon = "";
  switch (true) {
    case charIndex < 32:
      unitIcon = `/images/unit_icons/${charIndex - 25}.png`;
      break;
    case charIndex < 37:
      unitIcon = `/images/unit_icons/${charIndex - 30}.png`;
      break;
    case charIndex < 42:
      unitIcon = `/images/unit_icons/${charIndex - 35}.png`;
      break;
    case charIndex < 47:
      unitIcon = `/images/unit_icons/${charIndex - 40}.png`;
      break;
    case charIndex < 52:
      unitIcon = `/images/unit_icons/${charIndex - 45}.png`;
      break;
    case charIndex < 57:
      unitIcon = `/images/unit_icons/${charIndex - 50}.png`;
      break;
  }

  return (
    <tr
      key={character.id}
      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
    >
      {/* CHARACTER ICON */}
      <td className="whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-center space-x-1">
          <img
            src={`/images/character_icons_extra/${
              AllCharacters.indexOf(character.name) + 1
            }.webp`}
            alt={character.name}
            className={`${
              charIndex <= 20
                ? "w-7 h-7 lg:w-10 lg:h-10"
                : "w-7 h-7 lg:w-9 lg:h-9"
            } object-contain`}
            loading="lazy"
          />
          {charIndex > 20 && (
            <img
              alt={character.name}
              src={`${unitIcon}`}
              className="w-7 h-7 object-contain"
            />
          )}
        </div>
      </td>

      {/* TOTAL COUNT */}
      <td className="whitespace-nowrap text-sm text-center font-bold text-gray-900 dark:text-white">
        {character.totalCount}
      </td>

      {/* CARD BREAKDOWN COLUMNS */}
      {cardBreakdownColumns}

      {/* LAST CARDS COLUMNS */}
      {lastCardsColumns}
    </tr>
  );
}
