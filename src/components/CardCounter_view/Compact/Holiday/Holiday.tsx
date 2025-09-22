import { useState } from "react";
import { useProsekaData } from "../../../../context/Data";
import { useTheme } from "../../../../context/Theme_toggle";
import CanvasTable from "../CanvasTable_container";
import { grouped, imgHost } from "../../../../constants/common";
import { TabNavigation } from "../../../Nav/TabNav";
export default function CanvasHoliday() {
  const { allCards, jpEvents } = useProsekaData();
  const { theme } = useTheme();
  const [holi, setHoli] = useState(1);
  const tabNames = ["Valentine's", "New Year"];
  const holidayGrid: [number, number] = [6, 7];

  const icons = Array(6)
    .fill(null)
    .map((_, i) => {
      return `/images/unit_icons/${i + 1}.png`;
    });

  const valen = jpEvents.filter((ev) => ev.type === "Valentine's Event");

  const ny = jpEvents.filter((ev) => ev.type === "New Year Event");
  const holidayEvents = holi === 1 ? valen : ny;
  const holidayCards = allCards.filter((card) =>
    holidayEvents.some((ev) => ev.cards.includes(card.id))
  );

  const dataPaths = holidayCards.map((card) => {
    const imgPath =
      card.rarity === 4 || card.rarity === 3
        ? "_t.webp"
        : card.rarity === 5
        ? "_bd.webp"
        : ".webp";
    let ro;
    let co;
    const iconPath = `${imgHost}/icons/${card.id}${imgPath}`;
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
      {" "}
      <div className="h-auto lg:min-h-[70px] ">
        <h1 className="text-center">Holiday</h1>
        <div
          className={`max-w-[350px] flex mx-auto  border-b ${
            theme === "light" ? "border-gray-200" : "border-gray-700 "
          }`}
        >
          {tabNames.map((tab, i) => (
            <div key={tab}>
              {" "}
              <TabNavigation
                currentTab={holi}
                setCurrentTab={setHoli}
                tab={tab}
                n={i + 1}
                tabs={tabNames}
              />
            </div>
          ))}
        </div>
      </div>
      <CanvasTable
        gridSize={holidayGrid}
        iconPaths={icons}
        filename={"holiday.png"}
        startAtRow2={false}
        dataPaths={dataPaths}
      />
    </div>
  );
}
