import gachas from "../../assets/json/gacha_banners.json";
import cards from "../../assets/json/cards.json";
export default function GachaTable() {
  const formatGachaId = (id: number) => String(id).padStart(3, "0");
  const formatCardId = (id: number) => String(id).padStart(4, "0");
  return (
    <div className="flex flex-col">
      {gachas.map((banner) => {
        const formattedGachaId = formatGachaId(banner.id);

        const gachaBannerImage = `/images/banners/${formattedGachaId}.webp`;
        return (
          <div className="flex flex-row p-5">
            {/* GACHA */}
            <div className="w-1/2 flex flex-col items-center justify-center ">
              <img src={gachaBannerImage} style={{ width: "150px" }} />
              <span className="text-sm">{banner.name}</span>
            </div>
            {/* CARDS */}
            <div className="w-1/2 flex flex-row items-center justify-evenly flex-wrap ">
              {banner["cards"].map((card) => {
                const formattedCardId = formatCardId(card);
                const cardIconImage = `/images/unit_icons/${formattedCardId}_t.webp`;
                return (
                  <img
                    src={cardIconImage}
                    style={{ width: "50px", height: "50px" }}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
