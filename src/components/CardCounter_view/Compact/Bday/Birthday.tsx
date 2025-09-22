import { useState } from "react";
import { useProsekaData } from "../../../../context/Data";
import CanvasTable from "../CanvasTable_container";
import { grouped, imgHost } from "../../../../constants/common";
import { useFilteredBatch } from "./useFilterbyBatch";
import { useTheme } from "../../../../context/Theme_toggle";
import { TabNavigation } from "../../../Nav/TabNav";
export default function CanvasBday() {
  const { allCards } = useProsekaData();
  const { theme } = useTheme();
  const [batch, setBatch] = useState(4);
  const tabNames = ["1st", "2nd", "3rd", "4th", "5th"];
  const bdayGrid: [number, number] = [6, 7];

  const icons = Array(6)
    .fill(null)
    .map((_, i) => {
      return `/images/unit_icons/${i + 1}.png`;
    });

  const bdayCards = useFilteredBatch({ cards: allCards, batchNumber: batch });

  const dataPaths = bdayCards.map((card) => {
    const iconPath = `${imgHost}/icons/${card.id}_bd.webp`;
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
      <div className="lg:min-h-[70px] ">
        <h1 className="text-center">Birthday / Anniversary</h1>
        <div
          className={`max-w-[350px] flex flex-row justify-center items-center mx-auto gap-5  border-b ${
            theme === "light" ? "border-gray-200" : "border-gray-700 "
          }`}
        >
          {tabNames.map((tab, i) => (
            <TabNavigation
              currentTab={batch}
              setCurrentTab={setBatch}
              tab={tab}
              n={i + 1}
              tabs={tabNames}
              key={tab}
            />
          ))}
        </div>
      </div>
      <CanvasTable
        gridSize={bdayGrid}
        iconPaths={icons}
        filename={"bday.png"}
        startAtRow2={false}
        dataPaths={dataPaths}
      />
    </div>
  );
}
