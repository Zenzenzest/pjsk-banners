export type GachaModalProps = {
  isGachaOpen: boolean;
  onClose: () => void;
  gachaId: number;
  sekaiId: number | undefined
};

type  GachaCardRarityRate ={
  id?: number;
  groupId?: number;
  cardRarityType: string;
  rate: number;
  lotteryType: string;
}
 type GachaDetail= {
  id: number;
  gachaId: number;
  cardId: number;
  weight: number;
  isWish: boolean;
}

 type GachaBehavior= {
  id: number;
  gachaId: number;
  groupId: number;
  priority: number;
  gachaBehaviorType: string;
  gachaSpinnableType: string;
  costResourceType?: string;
  costResourceQuantity?: number;
  costResourceId?: number;
  resourceCategory: string;
  spinCount: number;
  // spinLimit?: number;
  executeLimit?: number;
}

 type GachaPickup ={
  id?: number;
  gachaId: number;
  cardId: number;
  gachaPickupType?: string;
}

 type GachaInformation ={
  gachaId: number;
  summary: string;
  description: string;
}

export type IGachaInfo ={
  id: number;
  gachaType: string;
  name: string;
  seq: number;
  assetbundleName: string;
  startAt: number;
  endAt: number;
  drawableGachaHour?: number;
  gachaCeilItemId?: number;
  gachaCardRarityRateGroupId: number;
  gachaCardRarityRates: GachaCardRarityRate[];
  gachaDetails: GachaDetail[];
  gachaBehaviors: GachaBehavior[];
  gachaPickups: GachaPickup[];
  gachaPickupCostumes: never[];
  gachaInformation: GachaInformation;
  isShowPeriod: boolean;
  wishFixedSelectCount: number;
  wishLimitedSelectCount: number;
  wishSelectCount: number;
}