import type { CharacterCardData } from "./CounterTypes";

export default function CharacterCardCounter({
  character,
}: {
  character: CharacterCardData;
}) {
  const getRarityBarColor = (rarity: number) => {
    switch (rarity) {
      case 1:
        return "bg-gray-400";
      case 2:
        return "bg-green-400";
      case 3:
        return "bg-blue-400";
      case 4:
        return "bg-purple-400";
      default:
        return "bg-gray-400";
    }
  };

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

  const allCardTypes = [
    { rarity: 4, isLimited: true },
    { rarity: 4, isLimited: false },
    { rarity: 3, isLimited: false },
    { rarity: 2, isLimited: false },
  ];

  const cardDataMap = new Map(
    character.cardBreakdown.map((card) => [
      `${card.rarity}-${card.isLimited}`,
      card.count,
    ])
  );

  const completeCardList = allCardTypes.map((type) => ({
    ...type,
    count: cardDataMap.get(`${type.rarity}-${type.isLimited}`) || 0,
  }));

  // Sort to put 4star limited first
  const sortedCardBreakdown = completeCardList.sort((a, b) => {
    if (a.rarity === 4 && a.isLimited) return -1;
    if (b.rarity === 4 && b.isLimited) return 1;

    if (a.rarity !== b.rarity) return b.rarity - a.rarity;

    if (a.isLimited !== b.isLimited) return b.isLimited ? 1 : -1;

    return 0;
  });

  const portraitImg = `/images/cutouts/${character.id}.webp`;

  return (
    <div className="h-[450px] max-w-[264px] bg-gray-800 rounded-xl border border-gray-700 overflow-hidden transition-all duration-200 hover:border-gray-600 relative">
      <img src={portraitImg} className="w-full h-full object-cover" />

      {/* GLASS OVERLAY */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm p-3 rounded-b-xl">
        <div className="space-y-2">
          {/* CHARACTER NAME */}
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-white text-sm truncate">
              {character.name}
            </h3>
            {/* TOTAL COUNT */}
            <span className="text-xs text-gray-300 bg-gray-800/80 px-2 py-1 rounded">
              {character.totalCount}
            </span>
          </div>

          {/* CARD BREAKDOWN  */}
          <div className="space-y-1.5">
            {sortedCardBreakdown.map((card) => (
              <div
                key={`${card.rarity}-${card.isLimited}`}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-1.5">
                  {getStarIcon(card.rarity, card.isLimited)}
                  <span className="text-xs text-gray-300">
                    {card.rarity}★ {card.isLimited ? "L" : "P"}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {/* BAR VISUALIZATION*/}
                  <div className="w-16 bg-gray-700/50 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        card.isLimited
                          ? "bg-yellow-500"
                          : getRarityBarColor(card.rarity)
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          (card.count /
                            Math.max(
                              ...character.cardBreakdown.map((c) => c.count),
                              1
                            )) *
                            100
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
