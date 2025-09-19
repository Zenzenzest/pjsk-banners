import { useState } from "react";
import { useProsekaData } from "../../../../context/Data";
import CanvasTable from "../CanvasTable_container";
import { grouped } from "../../../../constants/common";
import { useFilteredBatch } from "./useFilterbyBatch";
import { useTheme } from "../../../../context/Theme_toggle";
export default function CompactBday() {
  const { allCards } = useProsekaData();
  const { theme } = useTheme();
  const [batch, setBatch] = useState(1);
  const bdayGrid: [number, number] = [6, 7];

  const icons = Array(6)
    .fill(null)
    .map((_, i) => {
      return `/images/unit_icons/${i + 1}.png`;
    });

  const bdayCards = useFilteredBatch({ cards: allCards, batchNumber: batch });

  const dataPaths = bdayCards.map((card) => {
    const iconPath = `/images/card_icons/${card.id}_t.webp`;
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
      <div className="min-h-[90px]">
        <h1 className="text-center">Birthday / Anniversary</h1>
        <div
          className={`max-w-[350px] flex mx-auto  border-b ${
            theme === "light" ? "border-gray-200" : "border-gray-700 "
          }`}
        >
          <button
            onClick={() => setBatch(1)}
            className={`px-2 py-3 mr-2 w-1/4 text-sm font-medium relative transition-colors duration-200 ${
              batch === 1
                ? theme === "light"
                  ? "text-[#52649e]"
                  : "text-[#6b85d6]"
                : theme === "light"
                ? "text-gray-500 hover:text-gray-700"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            1st Rotation
            {batch === 1 && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#52649e]"></div>
            )}
          </button>

          <button
            onClick={() => setBatch(2)}
            className={`px-2 py-3 text-sm w-1/4 font-medium relative transition-colors duration-200 ${
              batch === 2
                ? theme === "light"
                  ? "text-[#52649e]"
                  : "text-[#6b85d6]"
                : theme === "light"
                ? "text-gray-500 hover:text-gray-700"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            2nd Rotation
            {batch === 2 && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#52649e]"></div>
            )}
          </button>
          <button
            onClick={() => setBatch(3)}
            className={`px-2 py-3 text-sm w-1/4 font-medium relative transition-colors duration-200 ${
              batch === 3
                ? theme === "light"
                  ? "text-[#52649e]"
                  : "text-[#6b85d6]"
                : theme === "light"
                ? "text-gray-500 hover:text-gray-700"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            3rd Rotation
            {batch === 3 && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#52649e]"></div>
            )}
          </button>
          <button
            onClick={() => setBatch(4)}
            className={`px-2 py-3 text-sm w-1/4 font-medium relative transition-colors duration-200 ${
              batch === 4
                ? theme === "light"
                  ? "text-[#52649e]"
                  : "text-[#6b85d6]"
                : theme === "light"
                ? "text-gray-500 hover:text-gray-700"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            4th Rotation
            {batch === 4 && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#52649e]"></div>
            )}
          </button>
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
