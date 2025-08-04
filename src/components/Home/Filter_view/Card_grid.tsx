import { useEffect } from "react";
import { ImageLoader } from "../../../hooks/imageLoader";
import type { CardGridPropType } from "../../Global/Types";

export default function CardGrid({ mode, cardId, cardName }: CardGridPropType) {
  const thumbLoader = ImageLoader(1);

  useEffect(() => {
    thumbLoader.reset();
  }, [cardId]);

  return (
    <div className="overflow-hidden rounded-sm sm:rounded-xl ">
      {!thumbLoader.isLoaded && (
        <div className="animate-pulse bg-gray-300 dark:bg-gray-600 aspect-[1.76/1] w-full rounded-lg" />
      )}
      <div className={`${thumbLoader.isLoaded ? "contents" : "hidden"}`}>
        {/* Treating miku touhou card as if its a bday card */}
        {/* because no trained image lol wtf */}
        {/* imagine paying for no trained image */}
        <img
          src={`/images/card_thumbnails/${cardId}${
            cardId === 1167 || mode === "bd" ? "_bd" : mode === "t" ? "_t" : "" 
          }.webp`}
          className={`h-auto w-full max-w-[300px] ml-auto mr-auto rounded`}
          alt={cardName}
          onLoad={thumbLoader.handleLoad}
          fetchPriority="high"
        />
      </div>
    </div>
  );
}
