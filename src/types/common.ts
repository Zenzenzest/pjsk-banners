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
  charId: number;
  collab_tag?: string;
};

export type BannerTypes = {
  id: number;
  name: string;
  cards: number[];
  start: number;
  end: number;
  banner_type: string;
  type?: string;
  confirmation?: string;
  event_id?: number;
  rerun?: number[];
  characters: number[];
  keywords?: string[] | undefined;
  en_id?: number;
  tag?: string;
  questionable?: string;
  sekai_id?: number;
  gachaDetails: number[];
};

export type EventTypes = {
  id: number;
  name: string;
  unit: string;
  start: number;
  end: number;
  close: number;
  cards: number[];
  banner_id?: number;
  event_type: string;
  keywords: string[];
  type: string;
};
