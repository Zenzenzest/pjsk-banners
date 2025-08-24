import type { CharacterCardData } from "./CounterTypes";

import { RARITY_COLORS } from "./config";
export default function CharacterCardCounter({
  character,
  isMobile,
  isVerySmol,
}: {
 character: CharacterCardData & { 
    sortedCardBreakdown: Array<{rarity: number, isLimited: boolean, count: number}>;
    maxCount: number;
  };
  isMobile: boolean;
  isVerySmol: boolean;
}) {
  const getRarityBarColor = (rarity: number) =>
    RARITY_COLORS[rarity] || "bg-gray-400";

  const getStarIcon = (rarity: number, isLimited: boolean) => {
    const iconPath =
      isLimited && rarity === 4
        ? "/images/rarity_icons/trained_star.png"
        : "/images/rarity_icons/untrained_star.png";

    return (
      <img
        src={iconPath}
        alt={`${isLimited ? "Limited" : "Permanent"} star`}
        className="w-4 h-4"
      />
    );
  };


  const sortedCardBreakdown = character.sortedCardBreakdown;
  const maxCount = character.maxCount;
  const portraitImg = `/images/cutouts/${character.id}.webp`;

  return (
    <div
      className={`${
        isMobile ? "min-h-[325px]" : "h-[450px]"
      } max-w-[264px] rounded-xl overflow-hidden 
     transition-all duration-200 hover:opacity-90 relative
     border-2 border-blue-500/30`}
    >
      {/* PORTRAIT IMAGE*/}
      <div className="relative h-full">
        <img
          src={portraitImg}
          width={264}
          height={isMobile ? 325 : 450}
          className="w-full h-full object-cover rounded-t-xl"
          loading="lazy"
          decoding="async"
        />

        {/* GRADIENT*/}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>

      {/* GLASS OVERLAY */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm p-3 rounded-b-xl">
        <div className="space-y-2">
          {/* CHARACTER NAME */}
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-white text-sm truncate">
              {character.name}
            </h3>
            {/* TOTAL COUNT */}
            <span className="text-xs text-gray-200 bg-blue-700/80 px-2 py-1 rounded">
              {character.totalCount}
            </span>
          </div>

          {/* CARD BREAKDOWN  */}
          <div className="space-y-1.5">
            {sortedCardBreakdown.map((card, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  {getStarIcon(card.rarity, card.isLimited)}
                  {!isVerySmol ? (
                    <span className="text-xs text-gray-300">
                      {card.rarity}★ {card.isLimited ? "Limited" : "Permanent"}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-300">
                      {card.rarity}★ {card.isLimited ? "L" : "P"}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {/* BAR VISUALIZATION*/}
                  <div className={`w-10 bg-gray-700/50 rounded-full h-1.5`}>
                    <div
                      className={`h-1.5 rounded-full ${
                        card.isLimited
                          ? "bg-yellow-500"
                          : getRarityBarColor(card.rarity)
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          (card.count / maxCount) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>

                  {/* COUNT */}
                  <span className="text-xs font-medium text-white w-6 text-right">
                    {card.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
