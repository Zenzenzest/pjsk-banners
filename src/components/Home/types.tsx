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
  Unit: null;
  Attribute: string[];
  Rarity: string[];
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

export interface CountdownProps {
  startDate: Date;
}
export interface CardState {
  cardId: number;
  rarity: number;
  trainedUrl: string;
  untrainedUrl: string;
  lastName: string;
  firstName: string;
  cardName: string;
  cardAttribute: string;
}

export interface CardModalProps extends CardState {
  isOpen: boolean;
  onClose: () => void;
}