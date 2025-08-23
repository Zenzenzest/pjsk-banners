import AllCards from "../../assets/json/cards.json";

import CharacterCardCounter from "./Card_grid";
import { AllCharacters } from "./characters";
import type { AllCardTypes } from "./CounterTypes";
import { useServer } from "../../context/Server";
import ProcessCardData from "./process_card";
import { useTheme } from "../../context/Theme_toggle";
import WebsiteDisclaimer from "../Nav/Website_disclaimer";

const SUB_UNIT = [
  "Leo/Need",
  "MORE MORE JUMP!",
  "Vivid BAD SQUAD",
  "Wonderlands x Showtime",
  "Nightcord at 25:00",
];

const VS = [
  "Hatsune Miku",
  "Kagamine Rin",
  "Kagamine Len",
  "Megurine Luka",
  "MEIKO",
  "KAITO",
];

export default function CounterContainer() {
  const charactersCounter: { [key: string]: number } = {};
  const { server } = useServer();
  const { theme } = useTheme();
  const allowedCardTypes = new Set(["permanent", "limited"]);
  const today = Date.now();
  const getCharacterId = (card: AllCardTypes) => {
    const isVirtualSinger = card.unit === "Virtual Singers";

    if (!isVirtualSinger || !card.sub_unit) {
      return AllCharacters.indexOf(card.character) + 1;
    }

    // VS with sub_unit
    const vsId = AllCharacters.indexOf(card.character) + 1;
    const vsIndex = VS.indexOf(card.character) + 1;
    const groupIndex = SUB_UNIT.indexOf(card.sub_unit) + 1;

    return vsId + 4 * vsIndex + 1 + groupIndex;
  };

  // character code
  const createCharCode = (
    characterId: number,
    cardType: string,
    rarity: number
  ) => `${characterId}-${cardType}-${rarity}`;

  AllCards.forEach((card) => {
    const isReleased =
      server === "jp" ? today > card.jp_released : today > card.en_released;
    if (
      !allowedCardTypes.has(card.card_type) ||
      card.rarity === 1 ||
      !isReleased ||
      (card.unit === "Virtual Singers" && !card.sub_unit)
    ) {
      return;
    }

    const characterId = getCharacterId(card);
    const charCode = createCharCode(characterId, card.card_type, card.rarity);

    // increment counter
    charactersCounter[charCode] = (charactersCounter[charCode] ?? 0) + 1;
  });

  const cardData = Object.entries(charactersCounter).map(([key, count]) => {
    const [charId, card_type, rarity] = key.split("-");

    return {
      charId,
      rarity: parseInt(rarity) as 2 | 3 | 4,
      card_type: card_type as "permanent" | "limited",
      count,
    };
  });

  const processedData = ProcessCardData(cardData);
  console.log(processedData);
  return (
    <div
      className={`p-4 flex flex-col justify-center items-center transition-all duration-300 ease-in-out ${
        theme === "dark" ? "bg-[#101828]" : "bg-[#f9fafb]"
      } `}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          Character Card Count
        </h1>
        <p className="text-gray-400"></p>
      </div>

      <div className="grid grid-cols-1 max-w-5xl sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4 mb-5">
        {processedData.map((character, i) => (
          <CharacterCardCounter key={i} character={character} />
        ))}
      </div>

      <WebsiteDisclaimer />
    </div>
  );
}
