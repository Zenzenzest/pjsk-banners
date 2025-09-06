interface ImageLoaderResult {
  isLoaded: boolean;
  handleLoad: () => void;
  reset: () => void;
}

export type CardIconTypes = {
  imgUrl: string;
  iconsLoader: ImageLoaderResult;
  cardId: number;
};
