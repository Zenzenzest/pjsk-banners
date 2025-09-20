import { useState } from "react";
import { useProsekaData } from "../../../../context/Data";
import CanvasTable from "../CanvasTable_container";
import { useTheme } from "../../../../context/Theme_toggle";
import { grouped, imgHost } from "../../../../constants/common";
type UnitKey = "mmj" | "wxs" | "l/n" | "n25" | "vbs";
const unit_mapping: Record<UnitKey, string> = {
  mmj: "MORE MORE JUMP!",
  wxs: "Wonderlands x Showtime",
  "l/n": "Leo/Need",
  n25: "Nightcord at 25:00",
  vbs: "Vivid BAD SQUAD",
};

export default function FocusEvent() {
  const [eventRotation, setEventRotation] = useState(6);
  const { jpEvents } = useProsekaData();
  const { theme } = useTheme();
  const focusEventGrid: [number, number] = [5, 5];

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
    return number === eventRotation;
  });
  const dataPaths = filteredEventsByRotation.map((ev) => {
    const iconPath = `${imgHost}/icons/${ev.cards[0]}_ut.webp`;
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
    <div>
      <div className="min-h-[70px]">
        <h1 className="text-center">Focus Events</h1>
        <div
          className={`max-w-[350px] flex mx-auto  border-b ${
            theme === "light" ? "border-gray-200" : "border-gray-700 "
          }`}
        >
          <button
            onClick={() => setEventRotation(1)}
            className={`px-2 py-3 mr-2 w-1/6 text-sm font-medium relative transition-colors duration-200 ${
              eventRotation === 1
                ? theme === "light"
                  ? "text-[#52649e]"
                  : "text-[#6b85d6]"
                : theme === "light"
                ? "text-gray-500 hover:text-gray-700"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            1st
            {eventRotation === 1 && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#52649e]"></div>
            )}
          </button>

          <button
            onClick={() => setEventRotation(2)}
            className={`px-2 py-3 text-sm w-1/6 font-medium relative transition-colors duration-200 ${
              eventRotation === 2
                ? theme === "light"
                  ? "text-[#52649e]"
                  : "text-[#6b85d6]"
                : theme === "light"
                ? "text-gray-500 hover:text-gray-700"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            2nd
            {eventRotation === 2 && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#52649e]"></div>
            )}
          </button>
          <button
            onClick={() => setEventRotation(3)}
            className={`px-2 py-3 text-sm w-1/6 font-medium relative transition-colors duration-200 ${
              eventRotation === 3
                ? theme === "light"
                  ? "text-[#52649e]"
                  : "text-[#6b85d6]"
                : theme === "light"
                ? "text-gray-500 hover:text-gray-700"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            3rd
            {eventRotation === 3 && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#52649e]"></div>
            )}
          </button>
          <button
            onClick={() => setEventRotation(4)}
            className={`px-2 py-3 text-sm w-1/6 font-medium relative transition-colors duration-200 ${
              eventRotation === 4
                ? theme === "light"
                  ? "text-[#52649e]"
                  : "text-[#6b85d6]"
                : theme === "light"
                ? "text-gray-500 hover:text-gray-700"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            4th
            {eventRotation === 4 && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#52649e]"></div>
            )}
          </button>
          <button
            onClick={() => setEventRotation(5)}
            className={`px-2 py-3 text-sm w-1/6 font-medium relative transition-colors duration-200 ${
              eventRotation === 5
                ? theme === "light"
                  ? "text-[#52649e]"
                  : "text-[#6b85d6]"
                : theme === "light"
                ? "text-gray-500 hover:text-gray-700"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            5th
            {eventRotation === 5 && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#52649e]"></div>
            )}
          </button>
          <button
            onClick={() => setEventRotation(6)}
            className={`px-2 py-3 text-sm w-1/6 font-medium relative transition-colors duration-200 ${
              eventRotation === 6
                ? theme === "light"
                  ? "text-[#52649e]"
                  : "text-[#6b85d6]"
                : theme === "light"
                ? "text-gray-500 hover:text-gray-700"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            6th
            {eventRotation === 6 && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#52649e]"></div>
            )}
          </button>
        </div>
      </div>
      <CanvasTable
        gridSize={focusEventGrid}
        iconPaths={icons}
        filename={"focus.png"}
        startAtRow2={false}
        dataPaths={dataPaths}
      />
    </div>
  );
}
