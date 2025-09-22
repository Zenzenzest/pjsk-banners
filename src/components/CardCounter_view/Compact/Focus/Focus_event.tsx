import { useState, useRef } from "react";
import { useProsekaData } from "../../../../context/Data";
import CanvasTable from "../CanvasTable_container";
import type { TableCanvasRef } from "../CanvasTable_container";
import { useTheme } from "../../../../context/Theme_toggle";
import { grouped, imgHost } from "../../../../constants/common";
import { TabNavigation } from "../../../Nav/TabNav";

type UnitKey = "mmj" | "wxs" | "l/n" | "n25" | "vbs";
const unit_mapping: Record<UnitKey, string> = {
  mmj: "MORE MORE JUMP!",
  wxs: "Wonderlands x Showtime",
  "l/n": "Leo/Need",
  n25: "Nightcord at 25:00",
  vbs: "Vivid BAD SQUAD",
};

export default function CanvasFocusEvent() {
  const [currentTab, setCurrentTab] = useState(6);
  const tabNames = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
  const { jpEvents } = useProsekaData();
  const { theme } = useTheme();
  const focusEventGrid: [number, number] = [5, 5];
  const canvasRef = useRef<TableCanvasRef>(null);

  const icons = Array(5)
    .fill(null)
    .map((_, i) => {
      return `/images/unit_icons/${i + 2}.png`;
    });

  const filteredEvents = jpEvents.filter((ev) => {
    const evKeywords = ev.keywords;
    const isFocus = evKeywords.includes("focus");

    return isFocus;
  });

  const filteredEventsByRotation = filteredEvents.filter((ev) => {
    const evKeywords = ev.keywords;

    const findNumber = evKeywords.find(
      (str) => str !== "n25" && /\d/.test(str)
    );
    const match = findNumber?.match(/\d+/);
    const number = match ? parseInt(match[0], 10) : null;
    return number === currentTab;
  });

  const dataPaths = filteredEventsByRotation.map((ev) => {
    const iconPath = `${imgHost}/jp_events/${ev.id}.webp`;
    const convertedUnitName = unit_mapping[ev.unit as UnitKey];
    const whoseFocus = ev.type.split(" ");
    const name = whoseFocus.slice(0, -3).join(" ");

    let ro;
    let co;
    Object.keys(grouped).map((unit, i) => {
      if (unit === convertedUnitName) {
        ro = i;
        const charIndex = grouped[unit].findIndex((member) =>
          member.includes(name)
        );
        co = charIndex + 2;
      }
    });
    return { iconPath: iconPath, row: ro, col: co };
  });

  return (
    <div className="max-w-full">
      {" "}
      <div className="lg:min-h-[70px] w-full overflow-scroll flex flex-col justify-center items-center">
        <h1 className="text-center">Focus Events</h1>
        <div
          className={`max-w-[350px] flex flex-row items-center justify-center mx-auto border-b ${
            theme === "light" ? "border-gray-200" : "border-gray-700"
          }`}
        >
          {tabNames.map((tab, i) => (
            <div key={tab}>
              {" "}
              <TabNavigation
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                tab={tab}
                n={i + 1}
                tabs={tabNames}
              />
            </div>
          ))}
        </div>
      </div>
      {/* SCROLLABLE CONTAINER */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[600px] w-max mx-auto">
          <CanvasTable
            ref={canvasRef}
            gridSize={focusEventGrid}
            iconPaths={icons}
            startAtRow2={false}
            dataPaths={dataPaths}
            wide={true}
          />
        </div>
      </div>
      <div className="flex justify-center gap-3 mt-5">
        <button
          onClick={() => canvasRef.current?.saveImage("focus.png")}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 cursor-pointer"
        >
          Save as Image
        </button>
      </div>
    </div>
  );
}
