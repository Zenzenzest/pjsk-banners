import { useTheme } from "../../context/Theme_toggle";
import type { ReactNode } from "react";
type TabNavigationProps = {
  currentTab: number;
  setCurrentTab: (tab: number) => void;
  tab: ReactNode | string;
  n: number;
  tabs: string[];
};
export const TabNavigation = ({
  currentTab,
  setCurrentTab,
  tab,
  n,
  tabs,
}: TabNavigationProps) => {
  const { theme } = useTheme();
  return (
    <button
      onClick={() => setCurrentTab(n)}
      className={`px-2 py-3 mr-2 w-1/${
        tabs.length
      } text-xs sm:text-sm font-medium relative transition-colors duration-200 cursor-pointer ${
        currentTab === n
          ? theme === "light"
            ? "text-[#52649e]"
            : "text-[#6b85d6]"
          : theme === "light"
          ? "text-gray-500 hover:text-gray-700"
          : "text-gray-400 hover:text-gray-200"
      }`}
    >
      {tab}
      {currentTab === n && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#52649e]"></div>
      )}
    </button>
  );
};
