interface CharacterCardData {
  id: string;
  name: string;
  totalCount: number;
  cardBreakdown: {
    rarity: 1 | 2 | 3 | 4;
    isLimited: boolean;
    count: number;
  }[];
}

export default function CharacterCardCounter({
  character,
}: {
  character: CharacterCardData;
}) {
  const getRarityColor = (rarity: number) => {
    switch (rarity) {
      case 1:
        return "text-gray-400";
      case 2:
        return "text-green-400";
      case 3:
        return "text-blue-400";
      case 4:
        return "text-purple-400";
      default:
        return "text-gray-400";
    }
  };


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


  const getBadgeColor = (rarity: number, isLimited: boolean) => {
    if (isLimited) {
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    }
    switch (rarity) {
      case 1:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      case 2:
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case 3:
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case 4:
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };


  const renderStars = (rarity: number) => {
    return (
      <div className="flex">
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            className={`text-xs ${
              i < rarity ? getRarityColor(rarity) : "text-gray-600"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden transition-all duration-200 hover:border-gray-600 min-w-[200px] xs:min-w-[150px]">
      {/* HEADER*/}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="font-bold text-white">
              {character.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-white">{character.name}</h3>
            <p className="text-sm text-gray-400">
              {character.totalCount} cards
            </p>
          </div>
        </div>
      </div>

      {/* CCARD BREAKDOWN*/}
      <div className="px-4 pb-4 border-t border-gray-700/50">
        <div className="space-y-2 mt-3">
          {character.cardBreakdown.map((card, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${getBadgeColor(
                card.rarity,
                card.isLimited
              )}`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  {renderStars(card.rarity)}
                  <span className="text-sm font-medium ml-1">
                    {card.isLimited ? "Limited" : "Permanent"}
                  </span>
                </div>
                <span className="font-bold text-lg">{card.count}</span>
              </div>

              {/* BAR VISUALIZATION */}
              <div className="mt-2 w-full bg-gray-700/50 rounded-full h-1.5">
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
                          ...character.cardBreakdown.map((c) => c.count)
                        )) *
                        100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
