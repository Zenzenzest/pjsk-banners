import { useState } from "react";
import DateTabs from "./Calendar_view/Date_tabs";
import { useTheme } from "../context/Theme_toggle";
import FilterTab from "./Filter_view/Filter_Container";
import { useServer } from "../context/Server";
import SavedBannersContainer from "./SavedBanners/SavedBanners_container";
import CardCounterContainer from "./CardCounter_view/CardCounter_container";
import { useProsekaData } from "../context/Data";
import LoadingComponent from "./Loading";

type ViewModeType = "dateview" | "filterview" | "counterview";

export default function HomeContainer() {
  const [viewMode, setViewMode] = useState<ViewModeType>("dateview");
  const { server } = useServer();
  const { theme } = useTheme();
  // const { loading = true } = useProsekaData();
  const handleDateViewMode = () => setViewMode("dateview");
  const handleFilterViewMode = () => setViewMode("filterview");
  const handleCounterViewMode = () => setViewMode("counterview");
  const loading = true;
  // helper function for tab styling
  const getTabClass = (tab: ViewModeType) => {
    const baseClass =
      " py-2 flex-1 text-center cursor-pointer transition-all duration-150 font-medium text-sm whitespace-nowrap";

    if (viewMode === tab) {
      // Active tab styles
      return theme === "dark"
        ? `${baseClass} bg-blue-500/10 text-blue-400 border rounded-t-md border-blue-500/20 r
         relative`
        : `${baseClass} bg-blue-100 text-blue-700 border rounded-t-md border-blue-200 
         relative`;
    } else {
      // inactive tab styles
      return theme === "dark"
        ? `${baseClass} hover:bg-gray-700/50 text-gray-300 border border-transparent`
        : `${baseClass} hover:bg-gray-100 text-gray-600 border border-transparent`;
    }
  };

  return (
    <div>
      <div className="flex flex-col h-full">
        {server !== "saved" ? (
          <div>
            {/* VIEWMODE TABS */}
            <div
              className={`w-full flex items-center justify-center min-h-[44px] ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } shadow-sm border ${
                theme === "dark" ? "border-gray-700" : "border-gray-200"
              } `}
            >
              <div className="flex w-full">
                <div
                  onClick={handleDateViewMode}
                  className={getTabClass("dateview")}
                >
                  <span className="truncate">Calendar View</span>
                </div>
                <div
                  onClick={handleFilterViewMode}
                  className={getTabClass("filterview")}
                >
                  <span className="truncate">Filter & Search</span>
                </div>
                <div
                  onClick={handleCounterViewMode}
                  className={getTabClass("counterview")}
                >
                  <span className="truncate">Card Counter</span>
                </div>
              </div>
            </div>

            {loading ? (
              <LoadingComponent />
            ) : (
              <div>
                {/* VIEWMODE OPTIONS */}
                {viewMode === "dateview" && <DateTabs />}
                {viewMode === "filterview" && <FilterTab />}

                {viewMode === "counterview" && <CardCounterContainer />}
              </div>
            )}
          </div>
        ) : (
          <SavedBannersContainer />
        )}
      </div>
    </div>
  );
}
