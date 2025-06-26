import { useState, useEffect } from "react";
import GlobalBanners from "../../../assets/json/en_banners.json";
import JpBbanners from "../../../assets/json/jp_banners.json";
import { useTheme } from "../../../context/Theme_toggle";

import GachaTable from "./Gacha_table";
import type { BannerTypes } from "../types";
import { useServer } from "../../../context/Server";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function DateTabs() {
  const { theme } = useTheme();
  const { server } = useServer();

  const years_global = [2021, 2022, 2023, 2024, 2025];
  const timeData_global = [
    { 2021: [11, 12] },
    { 2022: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },  
    { 2023: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { 2024: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { 2025: [1, 2, 3, 4, 5, 6, 7] },
  ];

  const years_jp = [2020, 2021, 2022, 2023, 2024, 2025];
  const timeData_jp = [
    { 2020: [9, 10, 11, 12] },
    { 2021: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { 2022: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { 2023: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { 2024: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { 2025: [1, 2, 3, 4, 5, 6, 7] },
  ];

  const years = server === "global" ? years_global : years_jp;
  const timeData = server === "global" ? timeData_global : timeData_jp;
  const dataBanners = server === "global" ? GlobalBanners : JpBbanners;

  // Get current date
  const currentDate = new Date();
  const currentYearValue = currentDate.getFullYear();
  const currentMonthValue = currentDate.getMonth() + 1; // Months are 0-indexed

  // Find the closest available year and month based on selected server
  const getInitialYear = (serverYears: number[]) => {
    // Check if current year is available
    if (serverYears.includes(currentYearValue)) {
      return currentYearValue;
    }

    // If not, find the latest year before current year
    for (let i = serverYears.length - 1; i >= 0; i--) {
      if (serverYears[i] <= currentYearValue) {
        return serverYears[i];
      }
    }
    return serverYears[0]; // Fallback to first year
  };

  const getInitialMonth = (
    year: number,
    serverYears: number[],
    serverTimeData: any[]
  ) => {
    const yearIndex = serverYears.indexOf(year);
    const availableMonths = serverTimeData[yearIndex][year];

    // If selected year is current year, try to select current month
    if (year === currentYearValue) {
      if (availableMonths.includes(currentMonthValue)) {
        return currentMonthValue;
      }
      // Find the latest month before current month
      for (let i = availableMonths.length - 1; i >= 0; i--) {
        if (availableMonths[i] <= currentMonthValue) {
          return availableMonths[i];
        }
      }
    }
    // Default to first month if current month not available
    return availableMonths[0];
  };

  // Get initial values based on selected server
  const getDefaultValues = () => {
    const defaultYear = getInitialYear(years);
    const defaultMonth = getInitialMonth(defaultYear, years, timeData);
    return { defaultYear, defaultMonth };
  };

  const { defaultYear, defaultMonth } = getDefaultValues();
  const [selectedYear, setSelectedYear] = useState<number>(defaultYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(defaultMonth);

  // To remember selected month for each year
  const [yearMonthMemory, setYearMonthMemory] = useState<
    Record<number, number>
  >({});

  // Initial year and month when server changes
  useEffect(() => {
    const { defaultYear: newDefaultYear, defaultMonth: newDefaultMonth } =
      getDefaultValues();
    setSelectedYear(newDefaultYear);
    setSelectedMonth(newDefaultMonth);
    // Clear when server changes since year/month availability might be different
    setYearMonthMemory({});
  }, [server]); // Only depend on server changes

  const getBannerStatus = (
    banner: BannerTypes
  ): "live" | "upcoming" | "past" => {
    const now = Date.now();
    if (Number(banner.start) <= now && now <= Number(banner.end)) return "live";
    if (Number(banner.start) > now) return "upcoming";
    return "past";
  };
  const filteredBanners: BannerTypes[] = dataBanners
    .filter((banner) => {
      const date = new Date(Number(banner.start));
      return (
        date.getFullYear() === selectedYear &&
        date.getMonth() + 1 === selectedMonth
      );
    })
    .sort((a, b) => Number(a.start) - Number(b.start)) // Primary sort by date
    .sort((a, b) => {
      const statusOrder = { live: 1, upcoming: 2, past: 3 };
      return statusOrder[getBannerStatus(a)] - statusOrder[getBannerStatus(b)];
    });
  const handleYearChange = (y: number) => {
    setSelectedYear(y);

    const yearIndex = years.indexOf(y);
    const availableMonths = timeData[yearIndex][y];

    // Check if we have a remembered month for this year
    const rememberedMonth = yearMonthMemory[y];

    if (rememberedMonth && availableMonths.includes(rememberedMonth)) {
      // Use remembered month if it's available
      setSelectedMonth(rememberedMonth);
    } else {
      // Use first available month for new years or if remembered month is no longer available
      setSelectedMonth(availableMonths[0]);
    }
  };

  const handleMonthChange = (m: number) => {
    setSelectedMonth(m);
    // Remember this month for the current year
    setYearMonthMemory((prev) => ({
      ...prev,
      [selectedYear]: m,
    }));
  };

  return (
    <div
      className={`w-full flex flex-col gap-3 pb-15 ${
        theme == "light"
          ? "bg-bg-light-mode2 text-text-light-mode"
          : "bg-bg-dark-mode text-gray-200"
      }`}
    >
      {/* DATE CONTAINER */}
      <div className="border-b border-gray-500/20 pb-2">
        {/* YEARS - Horizontal Scrollable on mobile */}
        <div className="flex overflow-x-auto py-2 px-1 hide-scrollbar">
          <div className="flex space-x-1 mx-auto">  
            {years.map((year) => (
              <button
                key={year}
                onClick={() => handleYearChange(year)}
                className={`px-2.5 py-1 rounded-full text-sm sm:text-base transition-colors ${
                  year === selectedYear
                    ? theme == "light"
                      ? "bg-highlight-dark-mode text-white"
                      : "bg-highlight-dark-mode text-white"
                    : theme == "light"
                    ? "hover:bg-gray-200"
                    : "hover:bg-gray-700"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* MONTHS - Grid layout */}
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1 px-1 py-2">
          {years.includes(selectedYear) &&
            timeData[years.indexOf(selectedYear)][selectedYear]?.map(
              (month) => (
                <button
                  key={month}
                  onClick={() => handleMonthChange(month)}
                  className={`px-2 py-1 rounded-md text-xs sm:text-sm text-center transition-colors ${
                    month === selectedMonth
                      ? theme == "light"
                        ? "bg-highlight-dark-mode text-white"
                        : "bg-highlight-dark-mode text-white"
                      : theme == "light"
                      ? "hover:bg-gray-200"
                      : "hover:bg-gray-700"
                  }`}
                >
                  {months[month - 1]}
                </button>
              )
            )}
        </div>
      </div>

      {/* GACHA BANNERS */}
      <GachaTable filteredBanners={filteredBanners} />
    </div>
  );
}
