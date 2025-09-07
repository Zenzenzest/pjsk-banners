export interface CardModalProps {
  isOpen: boolean;
  isLoading: boolean;
  isLoading2: boolean;
  onClose: () => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading2: React.Dispatch<React.SetStateAction<boolean>>;
  cardId: number;
}

export type CardReleasesType = {
  cardId: number;
};
