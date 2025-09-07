export type GachaModalProps = {
  isGachaOpen: boolean;
  onClose: () => void;
  gachaId: number;
  sekaiId: number | undefined
};