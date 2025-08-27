export type CardData = {
  charId: string;
  rarity: 2 | 3 | 4;
  card_type: "limited" | "permanent";
  count: number;
};

export type ProcessedCharacterData = {
  id: number;
  name: string;
  totalCount: number;
  cardBreakdown: {
    rarity: 2 | 3 | 4;
    isLimited: boolean;
    count: number;
  }[];
};

export type CharacterCardData = {
  id: number;
  name: string;
  totalCount: number;
  cardBreakdown: {
    rarity: 2 | 3 | 4;
    isLimited: boolean;
    count: number;
  }[];
};
