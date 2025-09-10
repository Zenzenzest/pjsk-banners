import type { AllCardTypes } from "../../../types/common";

export type GroupedCards = {
  [character: string]: {
    bloom_fes: AllCardTypes[];
    color_fes: AllCardTypes[];
    unit_limited: AllCardTypes[];
    bday: AllCardTypes[];
    movie_exclusive: AllCardTypes[];
    [key: string]: AllCardTypes[];
  };
};
