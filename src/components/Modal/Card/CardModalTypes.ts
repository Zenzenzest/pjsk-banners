
export type CardState = {
  cardId: number;
  rarity: number;
  name: string;
  cardName: string;
  cardAttribute: string;
  sekaiId: number;
  cardType: string;
}

export interface CardModalProps extends CardState {
  isOpen: boolean;
  isLoading: boolean;
  isLoading2: boolean;
  onClose: () => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading2: React.Dispatch<React.SetStateAction<boolean>>;
}


export type CardReleasesType = {
  cardId: number;
}