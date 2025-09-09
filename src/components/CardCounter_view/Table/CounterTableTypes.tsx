import type { CharacterData } from "../CounterTypes";
export type SortDirection = "asc" | "desc" | "default";
export type SortColumn =
  | "character"
  | "total"
  | "4-limited"
  | "4-permanent"
  | "3-permanent"
  | "2-permanent"
  | null;

export type FilterControlsProps = {
  showVirtualSingers: boolean;
  setShowVirtualSingers: (value: boolean) => void;
  showLN: boolean;
  setShowLN: (value: boolean) => void;
  showMMJ: boolean;
  setShowMMJ: (value: boolean) => void;
  showVBS: boolean;
  setShowVBS: (value: boolean) => void;
  showWxS: boolean;
  setShowWxS: (value: boolean) => void;
  showN25: boolean;
  setShowN25: (value: boolean) => void;
};

export type TableHeaderProps = {
  handleSort: (column: SortColumn, e: React.MouseEvent) => void;
  getSortIndicator: (column: SortColumn) => React.ReactNode;
};

export type TableRowProps = {
  character: CharacterData; // You'll need to import the proper type
  getRarityBarColor: (rarity: number, isLimited: boolean) => string;
  getMaxCountForCategory: (rarity: number, isLimited: boolean) => number;
  handleCardClick: (cardId: number) => void;
  isExpanded: boolean;
  onToggleExpand: (characterId: number) => void;
};
