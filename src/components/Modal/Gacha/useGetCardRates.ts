import jpBannersOrig from "../../../assets/jp.json";
import type { IGachaInfo } from "./GachaModalTypes";
export const useGetCardRates = ({
  cardId,
  bannerId,
}: {
  cardId?: number;
  bannerId?: number;
}) => {
  const bannerObj = (jpBannersOrig as IGachaInfo[]).find(
    (banner: IGachaInfo) => banner.id === bannerId
  );

  const getCardWeight = () => {
    if (!cardId || !bannerObj) return 0;

    const found = bannerObj.gachaDetails.find((card) => card.cardId === cardId);

    return found?.weight ?? 0;
  };

  const getTotal4starChance = () => {
    if (!cardId || !bannerObj) return 0;
    const rate = bannerObj.gachaCardRarityRates.find(
      (r) => r.cardRarityType === "rarity_4"
    );

    return rate?.rate ?? 0;
  };

  return { getCardWeight, getTotal4starChance };
};
