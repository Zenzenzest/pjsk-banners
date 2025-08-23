import { AllCharacters } from "./characters";
import type { CardData,ProcessedCharacterData } from "./CounterTypes";


export default function ProcessCardData(
  rawData: CardData[]
): ProcessedCharacterData[] {
  const characterMap: Record<string, CardData[]> = {};

  rawData.forEach((item) => {
    if (!characterMap[item.charId]) {
      characterMap[item.charId] = [];
    }
    characterMap[item.charId].push(item);
  });

  return Object.entries(characterMap)
    .map(([charIdStr, cards]) => {
      const charId = parseInt(charIdStr);

      const characterName = AllCharacters[charId - 1];

      if (!characterName) {
        return null;
      }

      // Convert to cardBreakdown format directly using the count field
      const cardBreakdown = cards.map((card) => ({
        rarity: card.rarity as 1 | 2 | 3 | 4,
        isLimited: card.card_type === "limited",
        count: card.count,
      }));


      const totalCount = cardBreakdown.reduce(
        (sum, card) => sum + card.count,
        0
      );

      return {
        id: charId,
        name: characterName,
        totalCount,
        cardBreakdown,
      };
    })
    .filter(Boolean) as ProcessedCharacterData[];
}
