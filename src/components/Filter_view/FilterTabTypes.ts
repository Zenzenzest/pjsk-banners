import type { Dispatch, SetStateAction } from "react";

export type CardFilterTypes = {
  Character: string[];
  Unit: string[];
  Attribute: string[];
  Rarity: (string | number)[];
  search: string;
  sub_unit: string[];
  Type: string[];
};

export type BannerFilterTypes = {
  "Banner Type": string[];
  Characters: string[];
  search: string;
  characterFilterMode: "all" | "any";
};

type viewModeType = string;

export type ViewModeTabsProps = {
  setViewMode: Dispatch<SetStateAction<"banners" | "cards">>;
  viewMode: viewModeType;
};

export type SearchInputProps = {
  viewMode: string;
  selectedBannerFilters: BannerFilterTypes;
  selectedCardFilters: CardFilterTypes;
  handleSearchChange: (searchTerm: string) => void;
};

export type CardFilterComponentTypes = {
  isOpen: boolean;
  tempCardFilters: CardFilterTypes;
  handleCardFilters: (category: string, option: string | number) => void;
  handleReset: () => void;
  handleApply: () => void;
};

export type BannerFilterComponentTypes = {
  isOpen: boolean;
  tempBannerFilters: BannerFilterTypes;
  handleBannerFilters: (category: string, option: string) => void;
  handleReset: () => void;
  handleApply: () => void;
  handleCharacterFilterModeToggle: () => void;
};


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
}

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
}

export type CardState = {
  cardId: number;
  rarity: number;
  name: string;
  cardName: string;
  cardAttribute: string;
  sekaiId: number;
  cardType: string;
}

export type SelectedCardFilterTypesProps = {
  selectedCardFilters: CardFilterTypes
};

export type SelectedBannerFilterTypesProps = {
  selectedBannerFilters: BannerFilterTypes
};

export type PaginationProps = {
    currentPage: number;
    totalPages: number;
    handlePageChange: (page: number) => void
}


export type CardThumbnailProps = {
  card:AllCardTypes;

}

export type CardGridProps = {
  mode: string;
  cardId: number;
  cardName: string;
}