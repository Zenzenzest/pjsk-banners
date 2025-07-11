import { useState } from "react";

import DateTabs from "./Calendar_view/Date_tabs";
import { useTheme } from "../../context/Theme_toggle";
import FilterTab from "./Filter_view/Filter_tab";
import { useServer } from "../../context/Server";
import SavedBannersContainer from "../SavedBanners/SavedBanners_container";

type ViewModeType = "dateview" | "filterview";

export default function HomeContainer() {
  const [viewMode, setViewMode] = useState<ViewModeType>("dateview");
  const { server } = useServer();
  const { theme } = useTheme();
  const handleDateViewMode = () => {
    setViewMode("dateview");
  };
  const handleFilterViewMode = () => {
    setViewMode("filterview");
  };

  return (
    <div>
      <div className="flex flex-col h-full">
        {server != "saved" ? (
          <div>
            {/* VIEWMODE TABS */}
            <div
              className={`w-full flex flex-row items-center justify-center text-center h-8 ${
                theme == "light" ? "bg-bg-light-mode2" : "bg-[#101828"
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
                    : "bg-bg-dark-mode"
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
                    : "bg-bg-dark-mode"
                } `}
              >
                Filter & Search
              </div>
            </div>
            {/* VIEWMODE OPTIONS */}
            {viewMode == "dateview" && <DateTabs />}
            {viewMode == "filterview" && <FilterTab />}
          </div>
        ) : (
          <SavedBannersContainer />
        )}
      </div>
    </div>
  );
}
