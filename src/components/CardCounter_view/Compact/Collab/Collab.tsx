import { useState } from "react";
import { useProsekaData } from "../../../../context/Data";
import { useTheme } from "../../../../context/Theme_toggle";
import { imgHost } from "../../../../constants/common";
import { grouped } from "../../../../constants/common";
import { TabNavigation } from "../../../Nav/TabNav";
import CanvasTable from "../CanvasTable_container";
export default function CanvasCollab() {
  const { allCards } = useProsekaData();
  const { theme } = useTheme();
  const [collab, setCollab] = useState(1);
  const tabNames = [
    "Deadly Sins",
    "Sanrio",
    "Ensemble Stars",
    "Touhou",
    "Tamagotchi",
  ];
  const collabGrid: [number, number] = [6, 7];
  const icons = Array(6)
    .fill(null)
    .map((_, i) => {
      return `/images/unit_icons/${i + 1}.png`;
    });

  const dsCards = allCards.filter((card) => card.collab_tag === "Deadly Sins");
  const snrCards = allCards.filter((card) => card.collab_tag === "Sanrio");
  const ens = allCards.filter((card) => card.collab_tag === "Ensemble");
  const tuhu = allCards.filter((card) => card.collab_tag === "Touhou");
  const tmg = allCards.filter((card) => card.collab_tag === "Tamagotchi");
  const collabCards =
    collab === 1
      ? dsCards
      : collab === 2
      ? snrCards
      : collab === 3
      ? ens
      : collab === 4
      ? tuhu
      : tmg;
  const dataPaths = collabCards.map((card) => {
    const imgPath =
      card.rarity === 4 || card.rarity === 3 ? "_t.webp" : ".webp";

    const iconPath = `${imgHost}/icons/${card.id}${imgPath}`;
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
        <h1 className="text-center">Collab</h1>
        <div
          className={`max-w-[350px] flex mx-auto  border-b ${
            theme === "light" ? "border-gray-200" : "border-gray-700"
          }`}
        >
          {tabNames.map((tab, i) => (
            <TabNavigation
              currentTab={collab}
              setCurrentTab={setCollab}
              tab={tab}
              n={i + 1}
              tabs={tabNames}
              key={tab}
            />
          ))}
        </div>
      </div>
      <CanvasTable
        gridSize={collabGrid}
        iconPaths={icons}
        filename={"collab.png"}
        startAtRow2={false}
        dataPaths={dataPaths}
      />
    </div>
  );
}
