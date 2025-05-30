import { useServer } from "../../context/Server";
import { useState } from "react";
import GachaTable from "./Gacha_table";
import CreateData from "./Create_data";
import DateTabs from "./Date_tabs";
import { useTheme } from "../../context/Theme_toggle";
import FilterTab from "./Filter_tab";

type ViewModeType = "dateview" | "filterview";

export default function HomeContainer() {
  const { server, setServer } = useServer();
  const [viewMode, setViewMode] = useState<ViewModeType>("dateview");
  const { theme } = useTheme();
  const handleDateViewMode = () => {
    setViewMode("dateview");
  };
  const handleFilterViewMode = () => {
    setViewMode("filterview");
  };

  return (
    <div>
      {/* VIEWMODE TABS */}
      <div
        className={`w-full flex flex-row items-center justify-center text-center h-8 ${
          theme == "light" ? "bg-bg-light-mode2" : ""
        }`}
      >
        <div
          onClick={() => handleDateViewMode()}
          className={`${
            viewMode == "dateview" &&
            "bg-highlight-dark-mode text-text-dark-mode"
          } ${
            viewMode == "filterview" && theme == "light"
              ? "text-text-light-mode"
              : ""
          } w-1/2 h-full pt-1`}
        >
          Calendar View
        </div>
        <div
          onClick={() => handleFilterViewMode()}
          className={`w-1/2 h-full pt-1 ${
            viewMode == "filterview" &&
            "bg-highlight-dark-mode text-text-dark-mode"
          } ${
            viewMode == "dateview" && theme == "light"
              ? "text-text-light-mode"
              : ""
          } `}
        >
          Filter View
        </div>
      </div>
      {/* VIEWMODE OPTIONS */}
      {viewMode == "dateview" ? <DateTabs /> : <FilterTab />}
    </div>
  );
}
