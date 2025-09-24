import { useState } from "react";
import { useProsekaData } from "../../../../context/Data";
import { useTheme } from "../../../../context/Theme_toggle";
import CanvasTable from "../CanvasTable_container";
import { grouped, imgHost } from "../../../../constants/common";
import { TabNavigation } from "../../../Nav/TabNav";
export default function CanvasHoliday() {
  const { allCards, jpEvents, jpBanners } = useProsekaData();
  const { theme } = useTheme();
  const [holi, setHoli] = useState(1);
  const tabNames = ["Valentine's", "New Year", "White Day", "Anniv"];
  const holidayGrid: [number, number] = [6, 7];

  const icons = Array(6)
    .fill(null)
    .map((_, i) => {
      return `/images/unit_icons/${i + 1}.png`;
    });

  const valen = jpEvents.filter((ev) => ev.type === "Valentine's Event");
  const ny = jpEvents.filter((ev) => ev.type === "New Year Event");
  const wd = jpEvents.filter((ev) => ev.type === "White Day Event");

  const annivBanners = jpBanners.filter((banner) => {
    const date = new Date(banner.start);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const allowedBanners = ["Colorful Festival", "Bloom Festival"];

    return (
      (month === 9 || month === 10) &&
      (day === 30 || day === 1) &&
      allowedBanners.includes(banner.banner_type)
    );
  });

  const holidayEvents =
    holi === 1 ? valen : holi === 2 ? ny : holi === 3 ? wd : annivBanners;
  const holidayCards = allCards.filter((card) => {
    if (holi !== 4) {
      return holidayEvents.some((ev) => ev.cards.includes(card.id));
    } else {
      let isAnnivLimCard = false;
      annivBanners.map((gc) => {
        if (card.card_type === "limited" && gc.cards.includes(card.id))
          isAnnivLimCard = true;
      });
      return isAnnivLimCard;
    }
  });

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
          className={`max-w-[400px] flex flex-row justify-center items-center mx-auto  border-b  ${
            theme === "light" ? "border-gray-200" : "border-gray-700 "
          }`}
        >
          {tabNames.map((tab, i) => (
            <TabNavigation
              currentTab={holi}
              setCurrentTab={setHoli}
              tab={tab}
              n={i + 1}
              tabs={tabNames}
              key={tab}
            />
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
