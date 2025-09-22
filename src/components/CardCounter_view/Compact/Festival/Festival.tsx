import { useState } from "react";
import { useProsekaData } from "../../../../context/Data";
import CanvasTable from "../CanvasTable_container";
import { grouped, imgHost } from "../../../../constants/common";
import { useTheme } from "../../../../context/Theme_toggle";
import { TabNavigation } from "../../../Nav/TabNav";
export default function CanvasFes() {
  const { theme } = useTheme();
  const [fes, setFes] = useState(1);
  const { allCards } = useProsekaData();
  const tabNames = ["Bloom", "Color"];

  const fesGrid: [number, number] = [6, 7];
  const icons = Array(6)
    .fill(null)
    .map((_, i) => {
      return `/images/unit_icons/${i + 1}.png`;
    });
  const bfesCards = allCards.filter((card) => card.card_type === "bloom_fes");
  const cfesCards = allCards.filter((card) => card.card_type === "color_fes");

  const fesCards = fes === 1 ? bfesCards : cfesCards;
  const dataPaths = fesCards.map((card) => {
    const iconPath = `${imgHost}/icons/${card.id}_t.webp`;
    let ro;
    let co;

    Object.keys(grouped).map((unit, i) => {
      if (card.unit === unit) {
        ro = i + 1;
        const charIndex = grouped[unit].indexOf(card.character);
        co = charIndex + 2;
      }
    });
    return { iconPath: iconPath, row: ro, col: co };
  });

  return (
    <div>
      <div className="h-auto lg:min-h-[70px] ">
        <h1 className="text-center">Festival</h1>
        <div
          className={`max-w-[350px] flex mx-auto  border-b ${
            theme === "light" ? "border-gray-200" : "border-gray-700 "
          }`}
        >
          {tabNames.map((tab, i) => (
            <TabNavigation
              currentTab={fes}
              setCurrentTab={setFes}
              tab={tab}
              n={i + 1}
              tabs={tabNames}
              key={tab}
            />
          ))}
        </div>
      </div>
      <CanvasTable
        gridSize={fesGrid}
        iconPaths={icons}
        filename={"bfes.png"}
        startAtRow2={false}
        dataPaths={dataPaths}
      />
    </div>
  );
}
