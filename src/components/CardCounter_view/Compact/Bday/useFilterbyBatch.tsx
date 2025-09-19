import { useMemo } from "react";
import type { AllCardTypes } from "../../../../types/common";
type useFilteredBatchProps = {
  cards: AllCardTypes[];
  batchNumber: number;
};
export const useFilteredBatch = ({
  cards,
  batchNumber,
}: useFilteredBatchProps) => {
  return useMemo(() => {
    if (!cards || !Array.isArray(cards) || batchNumber < 1) {
      return [];
    }

    const birthdayCards = cards.filter((card) => card.card_type === "bday");

    const startIndex = (batchNumber - 1) * 26;
    const endIndex = startIndex + 26;

    return birthdayCards.slice(startIndex, endIndex);
  }, [cards, batchNumber]);
};
