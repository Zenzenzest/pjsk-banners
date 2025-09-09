import { AllCharacters, Attributes } from "../../Counter_constants";
import type { TableRowProps } from "../CounterTableTypes";
import AllCards from "../../../../assets/json/cards.json";
import { notAllowedTypes } from "../../Counter_constants";
import { today } from "../../../../constants/common";
import { useServer } from "../../../../context/Server";

export default function TableRow({
  character,
  getRarityBarColor,
  getMaxCountForCategory,
  handleCardClick,
  isExpanded,
  onToggleExpand,
}: TableRowProps) {
  const { server } = useServer();

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
              onClick={(e) => {
                // prevent rowExpand trigger
                e.stopPropagation();
                handleCardClick(Number(cardId));
              }}
            />
          )}
        </div>
      </td>
    );
  });

  const charIndex = AllCharacters.indexOf(character.name) + 1;

  const attrBreakdown: { [key: string]: number } = {};

  AllCards.forEach((card) => {
    const isCharMatch = card.charId === charIndex;
    const isAllowed = !notAllowedTypes.includes(card.card_type);
    const isReleased =
      server === "global" ? today > card.en_released : today > card.jp_released;

    if (isCharMatch && isAllowed && isReleased) {
      let displayCardType = card.card_type;
      if (card.card_type === "unit_limited") {
        displayCardType = "limited";
      }

      const attrCode = `${card.rarity}-${displayCardType}-${card.attribute}`;
      if (attrBreakdown[attrCode]) {
        attrBreakdown[attrCode] += 1;
      } else {
        attrBreakdown[attrCode] = 1;
      }
    }
  });

  const renderAttrRow = (attr: string) => {
    return (
      <img
        src={`/images/attribute_icons/${attr}.webp`}
        alt={attr}
        className="w-6 h-6 object-contain"
      />
    );
  };

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

  const renderAttributeBreakdown = () => {
    if (Object.keys(attrBreakdown).length === 0) {
      return (
        <div className="text-gray-500 dark:text-gray-400 text-center py-4">
          No cards found for this character
        </div>
      );
    }

    const rarityStructure = {
      "4-limited": {
        label: "4★ Lim",
        attributes: {} as Record<string, number>,
      },
      "4-permanent": {
        label: "4★ Perm",
        attributes: {} as Record<string, number>,
      },
      "3-permanent": { label: "3★", attributes: {} as Record<string, number> },
      "2-permanent": { label: "2★", attributes: {} as Record<string, number> },
    };

    Object.entries(attrBreakdown).forEach(([key, count]) => {
      const [rarity, cardType, attribute] = key.split("-");
      const rarityKey = `${rarity}-${cardType}`;

      if (rarityStructure[rarityKey as keyof typeof rarityStructure]) {
        rarityStructure[rarityKey as keyof typeof rarityStructure].attributes[
          attribute
        ] = count;
      }
    });

    return (
      <div className="">
        <div className="flex flex-row justify-start items-start w-full text-gray-700 dark:text-gray-200 gap-2 ml-10">
          {Object.entries(rarityStructure).map(([key, data]) => (
            <div
              key={key}
              className="flex flex-col items-center space-y-1 px-5 flex-1"
            >
              <div className="font-medium text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                {data.label}
              </div>
              <div className="flex flex-row gap-1 justify-center">
                {Attributes.map((attr) => {
                  const count = data.attributes[attr] || 0;
                  return (
                    <div key={attr} className="flex flex-col items-center">
                      {renderAttrRow(attr)}
                      <span className="text-xs font-bold mt-1 w-6 text-center">
                        {count > 0 ? count : "-"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <>
      <tr
        key={character.id}
        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
        onClick={() => onToggleExpand(character.id)}
      >
        {/* CHARACTER ICON */}
        <td className="whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-gray-800">
          <div className="flex items-center space-x-2">
            {/* EXPAND ICON*/}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(character.id);
              }}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label={isExpanded ? "Collapse row" : "Expand row"}
            >
              <svg
                className={`w-3 h-3 text-gray-500 dark:text-gray-400 transform transition-transform ${
                  isExpanded ? "rotate-90" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <div className="flex items-center space-x-1">
              {/* CHAR ICON */}
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
                  className="w-5 h-5 object-contain"
                />
              )}
            </div>
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

      {/* EXPANDABLE ROW */}
      {isExpanded && (
        <tr>
          <td
            colSpan={2 + cardBreakdownColumns.length + lastCardsColumns.length}
            className="p-2 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-600"
          >
            <div className="min-h-[80px] w-full flex justify-start items-center ">
              {renderAttributeBreakdown()}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
