type Rarity = 3 | 4;
type PowerType = 1 | 2;
type PowerTable = Array<{
  level: number;
  power1: number;
  power2: number;
}>;

const powers_4stars: PowerTable = [
  { level: 1, power1: 12731, power2: 12832 },
  { level: 10, power1: 14599, power2: 14719 },
  { level: 20, power1: 16677, power2: 16818 },
  { level: 30, power1: 18754, power2: 18916 },
  { level: 40, power1: 20832, power2: 21015 },
  { level: 50, power1: 22911, power2: 23116 },
  { level: 53, power1: 27165, power2: 27398 },
  { level: 55, power1: 29202, power2: 29455 },
  { level: 58, power1: 32258, power2: 32539 },
  { level: 60, power1: 34295, power2: 34596 },
];

const powers_3stars: PowerTable = [
  { level: 1, power1: 11190, power2: 11280 },
  { level: 10, power1: 13286, power2: 13398 },
  { level: 20, power1: 15617, power2: 15753 },
  { level: 30, power1: 17948, power2: 18108 },
  { level: 40, power1: 20280, power2: 20464 },
  { level: 43, power1: 23905, power2: 24116 },
  { level: 45, power1: 25724, power2: 25953 },
  { level: 48, power1: 28451, power2: 28707 },
  { level: 50, power1: 30270, power2: 30544 },
];

export const calculatePower = (
  rarity: Rarity,
  powerType: PowerType,
  cardLevel: number
): number => {
  if (rarity == 3) {
    if (powerType == 1) {
      if (cardLevel <= powers_3stars[0].level) return powers_3stars[0].power1;
      if (cardLevel >= powers_3stars[powers_3stars.length - 1].level)
        return powers_3stars[powers_3stars.length - 1].power1;

      for (let i = 0; i < powers_3stars.length - 1; i++) {
        const lower = powers_3stars[i];
        const upper = powers_3stars[i + 1];

        if (cardLevel >= lower.level && cardLevel <= upper.level) {
          const ratio = (cardLevel - lower.level) / (upper.level - lower.level);
          const interpolatedPower =
            lower.power1 + ratio * (upper.power1 - lower.power1);
          return Math.round(interpolatedPower);
        }
      }
    } else {
      if (cardLevel <= powers_3stars[0].level) return powers_3stars[0].power2;
      if (cardLevel >= powers_3stars[powers_3stars.length - 1].level)
        return powers_3stars[powers_3stars.length - 1].power2;
      for (let i = 0; i < powers_3stars.length - 1; i++) {
        const lower = powers_3stars[i];
        const upper = powers_3stars[i + 1];

        if (cardLevel >= lower.level && cardLevel <= upper.level) {
          const ratio = (cardLevel - lower.level) / (upper.level - lower.level);
          const interpolatedPower =
            lower.power2 + ratio * (upper.power2 - lower.power2);
          return Math.round(interpolatedPower);
        }
      }
    }
  } else {
    if (powerType == 1) {
      if (cardLevel <= powers_4stars[0].level) return powers_4stars[0].power1;
      if (cardLevel >= powers_4stars[powers_4stars.length - 1].level)
        return powers_4stars[powers_4stars.length - 1].power1;
      for (let i = 0; i < powers_4stars.length - 1; i++) {
        const lower = powers_4stars[i];
        const upper = powers_4stars[i + 1];

        if (cardLevel >= lower.level && cardLevel <= upper.level) {
          const ratio = (cardLevel - lower.level) / (upper.level - lower.level);
          const interpolatedPower =
            lower.power1 + ratio * (upper.power1 - lower.power1);
          return Math.round(interpolatedPower);
        }
      }
    } else {
      if (cardLevel <= powers_4stars[0].level) return powers_4stars[0].power2;
      if (cardLevel >= powers_4stars[powers_4stars.length - 1].level)
        return powers_4stars[powers_4stars.length - 1].power2;
      for (let i = 0; i < powers_4stars.length - 1; i++) {
        const lower = powers_4stars[i];
        const upper = powers_4stars[i + 1];

        if (cardLevel >= lower.level && cardLevel <= upper.level) {
          const ratio = (cardLevel - lower.level) / (upper.level - lower.level);
          const interpolatedPower =
            lower.power2 + ratio * (upper.power2 - lower.power2);
          return Math.round(interpolatedPower);
        }
      }
    }
  }

  throw new Error("Level not within known range.");
};
