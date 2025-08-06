import type { Dispatch, SetStateAction } from 'react';

export interface BannerTypes {
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
}
export interface AllCardTypes {
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
}

export interface BannerGridProps {
  filteredBanners: BannerTypes[];
  handleCardClick: (card: AllCardTypes) => void;
}

export interface BannerStatusProps {
  bannerStatus: string;
  statusColor: string;
}

export interface CardsProps {
  banner: BannerTypes;
  handleCardClick: (card: AllCardTypes) => void;
}

export interface EventCardsProps {
  bannerCards: number[];
  bannerShopCards: number[];
  handleCardClick: (card: AllCardTypes) => void;
}

export interface EventDetailsProps {
  event_id: number;
  loadedImages: Set<string>;
  setLoadedImages: Dispatch<SetStateAction<string>>;
  handleCardClick: (card: AllCardTypes) => void;
  bannerCards: number[];
}

export interface BannerTemplateProps {
  banner: BannerTypes;
  mode: string;
  handleCardClick: (card: AllCardTypes) => void;
}
