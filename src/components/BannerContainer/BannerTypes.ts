import type { Dispatch, SetStateAction } from "react";
import type { AllCardTypes, BannerTypes } from "../../types/common";

export type EventTypes = {
  id: number;
  name: string;
  unit: string;
  start: number;
  end: number;
  close: number;
  cards: number[];
  banner_id?: number;
  event_type: string;
  keywords: string[];
  type: string;
};

export type BannerGridProps = {
  filteredBanners: BannerTypes[];
  handleCardClick: (card: AllCardTypes) => void;
};

export type BannerStatusProps = {
  bannerStatus: string;
  statusColor: string;
};

export type CardsProps = {
  banner: BannerTypes;
  handleCardClick: (card: AllCardTypes) => void;
};

export type EventCardsProps = {
  bannerCards: number[];
  bannerShopCards: number[];
  handleCardClick: (card: AllCardTypes) => void;
};

export type EventDetailsProps = {
  event_id: number;
  loadedImages: Set<string>;
  setLoadedImages: Dispatch<SetStateAction<string>>;
  handleCardClick: (card: AllCardTypes) => void;
  bannerCards: number[];
};

export type GridProps = {
  banner: BannerTypes;
  mode: string;
  handleCardClick: (card: AllCardTypes) => void;
  handleEventClick: (ev: number | undefined) => void;
  handleGachaClick: (gc: number | undefined) => void;
};

export type EventEndedProps = {
  endDate: Date;
  compact?: boolean;
};

export type BannerContainerProps = {
  filteredBanners: BannerTypes[];
  selectedYear?: number;
  selectedMonth?: number;
  parentRef: React.RefObject<HTMLDivElement | null>;
};

export type CardState = {
  cardId: number;
  rarity: number;
  name: string;
  cardName: string;
  cardAttribute: string;
  sekaiId: number;
  cardType: string;
};

export type CountdownProps = {
  targetDate: Date;
  mode?: "start" | "end";
  compact?: boolean;
  onComplete?: () => void;
};

export type useFormattedTimeType = {
  mode: string;
  banner?: { start: string | number; end: string | number };
  eventObj?: { start: string | number; end: string | number } | null;
};

export type WithEventProps = {
  mode?: string;
  banner: BannerTypes;
  handleCardClick: (card: AllCardTypes) => void;
  handleSaveBanner: (id: number) => void;
  isBannerSaved: (id: number) => boolean;
  handleEventClick: (ev: number | undefined) => void;
  handleGachaClick: (gc: number | undefined) => void;
};

export type WithoutEventProps = {
  banner: BannerTypes;
  handleSaveBanner: (id: number) => void;
  isBannerSaved: (id: number) => boolean;
};
