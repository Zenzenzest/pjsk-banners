import { useState } from "react";
import { useTheme } from "../../context/Theme_toggle";
import CardTable from "./Table/CharacterTable_container";
import CharacterContainer from "./Character/Character_container";
import SpecialCards from "./SpecialCards/SpecialCards_Container";

export default function CardCounterContainer() {
  const [selectedTab, setSelectedTab] = useState("table");
  const { theme } = useTheme();

  return (
    <div>
      <div
        className={`w-full flex border-b ${
          theme === "light"
            ? "border-gray-200 bg-[#f5f7f9]"
            : "border-gray-700 bg-[#101828]"
        }`}
      >
        <button
          onClick={() => setSelectedTab("portraits")}
          className={`px-4 py-3 mr-2 w-1/3 text-sm font-medium relative transition-colors duration-200 ${
            selectedTab === "portraits"
              ? theme === "light"
                ? "text-[#52649e]"
                : "text-[#6b85d6]"
              : theme === "light"
              ? "text-gray-500 hover:text-gray-700"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          Portrait
          {selectedTab === "portraits" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#52649e]"></div>
          )}
        </button>

        <button
          onClick={() => setSelectedTab("table")}
          className={`px-4 py-3 mr-2 w-1/3 text-sm font-medium relative transition-colors duration-200 ${
            selectedTab === "table"
              ? theme === "light"
                ? "text-[#52649e]"
                : "text-[#6b85d6]"
              : theme === "light"
              ? "text-gray-500 hover:text-gray-700"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          Table
          {selectedTab === "table" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#52649e]"></div>
          )}
        </button>

        <button
          onClick={() => setSelectedTab("special")}
          className={`px-4 py-3 w-1/3 text-sm font-medium relative transition-colors duration-200 ${
            selectedTab === "special"
              ? theme === "light"
                ? "text-[#52649e]"
                : "text-[#6b85d6]"
              : theme === "light"
              ? "text-gray-500 hover:text-gray-700"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          Special Cards
          {selectedTab === "special" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#52649e]"></div>
          )}
        </button>
      </div>

      {selectedTab === "table" ? (
        <CardTable />
      ) : selectedTab === "special" ? (
        <SpecialCards />
      ) : (
        <CharacterContainer />
      )}
    </div>
  );
}
