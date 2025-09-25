import { useTheme } from "../../context/Theme_toggle";
import { useServer } from "../../context/Server";
import SavedBannersContainer from "../SavedBanners/SavedBanners_container";

import { useProsekaData } from "../../context/Data";
import LoadingComponent from "../Loading";
import { NavLink, Outlet } from "react-router-dom";
import ServerToggle from "../Server/Server_toggle";

export default function NavigationContainer() {
  const { server } = useServer();
  const { theme } = useTheme();
  const { loading } = useProsekaData();

  // helper function for tab styling, usingNavLink's active state
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
    const baseClass =
      "py-2 flex-1 text-center cursor-pointer transition-all duration-150 text-sm whitespace-nowrap";

    if (isActive) {
      // Active tab styles
      return theme === "dark"
        ? `${baseClass} bg-blue-500/10 text-blue-400 border rounded-t-md border-blue-500/20 relative`
        : `${baseClass} bg-blue-100 text-blue-700 border rounded-t-md border-blue-200 relative`;
    } else {
      // inactive tab styles
      return theme === "dark"
        ? `${baseClass} hover:bg-gray-700/50 text-gray-300 border border-transparent`
        : `${baseClass} hover:bg-gray-100 text-gray-600 border border-transparent`;
    }
  };

  return (
    <div>
      <ServerToggle />
      <div className="flex flex-col h-full">
        {server !== "saved" ? (
          <div>
            {/* NAVIGATION TABS */}
            <nav
              className={`w-full flex items-center justify-center min-h-[44px] ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } shadow-sm border ${
                theme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex w-full">
                <NavLink to="/calendar" className={getNavLinkClass} end>
                  <span className="truncate">Calendar</span>
                </NavLink>
                <NavLink to="/filter" className={getNavLinkClass}>
                  <span className="truncate">Filter/Search</span>
                </NavLink>
                <NavLink to="/stats" className={getNavLinkClass}>
                  <span className="truncate">Stats</span>
                </NavLink>
              </div>
            </nav>

            {loading ? (
              <LoadingComponent />
            ) : (
              <div>
                {/* ROUTER CONTENT */}
                <Outlet />
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
