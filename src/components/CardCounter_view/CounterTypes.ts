export type AllCardTypes = {
  id: number;
  name: string;
  character: string;
  rarity: number;
  card_type: string;
  attribute: string;
  unit: string;
  sub_unit?: string;
  en_released: number;
  jp_released: number;
  jp_name: string;
  prev_id?: number;
  charId:number
};

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
