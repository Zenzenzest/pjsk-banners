export interface BannerTypes {
  id: number;
  name: string;
  cards: number[];
  start: number;
  end: number;
  banner_type?: string;
}
export interface GachaBannersProps {
  filteredBanners: BannerTypes[] | undefined;
}

export type SelectedFilterTypes = {
  Character: string[];
  Unit: string[];
  Attribute: string[];
  Rarity: (string | number)[];
};
export type SelectedFilterTypesProps = {
  selectedFilters: SelectedFilterTypes;
};

export interface CardsTypes {
  id: number;
  name: string;
  character: string;
  rarity: number;
  unit: string;
  released: number;
  attribute: string;
  sub_unit?: string;
  real_id: number;
  sekai_id: number;
  card_type: string;
}

export interface CardState {
  cardId: number;
  rarity: number;
  lastName: string;
  firstName: string;
  cardName: string;
  cardAttribute: string;
}

export interface CardModalProps extends CardState {
  isOpen: boolean;
  isLoading: boolean;
  isLoading2: boolean;
  onClose: () => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading2: React.Dispatch<React.SetStateAction<boolean>>;
}

export type CountdownProps = {
  targetDate: Date;
  mode?: "start" | "end";
  compact?: boolean;
  onComplete?: () => void;
};
export type EventEndedProps = {
  endDate: Date;
  compact?: boolean;
};
