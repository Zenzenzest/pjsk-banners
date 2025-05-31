export interface BannerTypes {
  id: number;
  name: string;
  cards: number[];
  start: number;
  end: number;
}
export interface GachaBannersProps {
  filteredBanners: BannerTypes[] | undefined;
}

export type SelectedFilterTypes = {
  Character: string[];
  Unit: string | null;
  Attribute: string | null;
  Rarity: number | null;
};

export interface CardsTypes {
  id: number;
  name: string;
  character: string;
  rarity: number;
  group: string;
  attribute: string;
  untrained_url: string;
  trained_url: string;
}
