import { useState } from "react";
import gachas from "../../assets/json/gacha_banners.json";
import cards from "../../assets/json/cards.json";
import { useTheme } from "../../context/Theme_toggle";
import type { BannerTypes, GachaBannersProps } from "./types";

export default function GachaTable({
  filteredBanners,
}: {
  filteredBanners: BannerTypes[];
}) {
  const [phrase, setPhrase] = useState("");
  const { theme } = useTheme();
  const formatId = (id: number) => String(id).padStart(4, "0");
  const today = Date.now();

  const handleImageClick = () => {};
  return (
    <div
      className={`flex flex-col ${
        theme == "light" ? "bg-bg-light-mode" : "bg-bg-dark-mode2"
      }`}
    >
      {filteredBanners.map((banner) => {
        const formattedGachaId = formatId(banner.id);
        const startDate = new Date(Number(banner.start));
        const endDate = new Date(Number(banner.end));
        const formattedStart = startDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        const formattedEnd = endDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        const diffInMs = today - endDate;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        const gachaBannerImage = `/images/banners/${formattedGachaId}.webp`;
        return (
          <div
            className="flex flex-row p-5 border-b border-gray-400"
            key={banner.id}
          >
            {/* GACHA */}
            <div className="w-1/2 flex flex-col items-center justify-center ">
              <img src={gachaBannerImage} style={{ width: "150px" }} />
              <span className="text-md text-center">{banner.name}</span>
              <div
                className={`flex flex-cols text-sm text-center gap-3 ${
                  theme == "light" ? "text-text-deco-light-mode" : "text-mizuki"
                }`}
              >
                <span>{formattedStart}</span>
                <span>{formattedEnd}</span>
              </div>
            </div>
            {/* CARDS */}
            <div className="w-1/2  flex flex-col items-center justify-center">
              <div className="flex flex-row items-center justify-evenly flex-wrap ">
                {banner["cards"].map((card, i) => {
                  const formattedCardId = formatId(card);
                  const cardIconImage = `/images/card_icons/${formattedCardId}_t.webp`;

                  return (
                    <div key={i}>
                      <img
                        src={cardIconImage}
                        style={{
                          width: "60px",
                          height: "auto",
                          margin: "0.3rem",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              {diffInDays >= 0 && <div>{diffInDays} days ago</div>}
              {diffInDays < 0 && <div>Ends in {diffInDays * -1} days</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
