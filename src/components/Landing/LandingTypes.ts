import type { BannerTypes } from "../../types/common";

export type BannerSwiperProps = {
  latestBanners: BannerTypes[];
  n: number;
};

export interface SwiperTypes {
  setSelectedBoss: React.Dispatch<React.SetStateAction<string>>;
}

export interface DynamicDataPropsType {
  [key: string]: object[];
}

export interface SelectedDataTypes {
  [vtuberName: string]: number;
}

export interface GenerationTypes {
  [genName: string]: string[];
}
