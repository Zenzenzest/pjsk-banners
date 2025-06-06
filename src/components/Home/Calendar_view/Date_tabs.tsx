import { useState, useEffect } from "react";
import GachaBanners from "../../../assets/json/gacha_banners.json";
import { useTheme } from "../../../context/Theme_toggle";

import GachaTable from "./Gacha_table";
import type { BannerTypes, GachaBannersProps } from "../types";

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
const years = [2021, 2022, 2023, 2024, 2025];
const timeData = [
  { 2021: [11, 12] },
  { 2022: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  { 2023: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  { 2024: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  { 2025: [1, 2, 3, 4, 5, 6, 7] },
];

export default function DateTabs() {
  const { theme } = useTheme();

  // Get current date
  const currentDate = new Date();
  const currentYearValue = currentDate.getFullYear();
  const currentMonthValue = currentDate.getMonth() + 1; // Months are 0-indexed in JS

  // Find the closest available year and month
  const getInitialYear = () => {
    // Check if current year is available
    if (years.includes(currentYearValue)) {
      return currentYearValue;
    }
    // If not, find the latest year before current year
    for (let i = years.length - 1; i >= 0; i--) {
      if (years[i] <= currentYearValue) {
        return years[i];
      }
    }
    return years[0]; // Fallback to first year
  };

  const getInitialMonth = (year: number) => {
    const yearIndex = years.indexOf(year);
    const availableMonths = timeData[yearIndex][year];

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

  const initialYear = getInitialYear();
  const initialMonth = getInitialMonth(initialYear);

  const [selectedYear, setSelectedYear] = useState<number>(initialYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(initialMonth);

  // Rest of your component remains the same...
  const filteredBanners: BannerTypes[] = GachaBanners.filter((banner) => {
    const date = new Date(Number(banner.start));
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return year === selectedYear && month === selectedMonth;
  });

  const handleYearChange = (y: number) => {
    setSelectedYear(y);
    setSelectedMonth(timeData[years.indexOf(y)][y][0]);
  };

  const handleMonthChange = (m: number) => {
    setSelectedMonth(m);
  };

  return (
    <div
      className={`w-full flex flex-col justify-center items-centers gap-3 ${
        theme == "light"
          ? "bg-bg-light-mode2 text-text-light-mode"
          : "bg-bg-dark-mode2"
      }`}
    >
      {/* DATE CONTAINER */}
      <div className="border-b">
        {/* YEARS */}
        <div className="h-12 flex flex-row items-center justify-evenly text-lg pt-3">
          {years.map((year) => (
            <div
              onClick={() => handleYearChange(year)}
              key={year}
              className={`${year == selectedYear ? "border-b-2" : ""} ${
                theme == "light"
                  ? "border-text-deco-light-mode"
                  : "border-mizuki"
              }`}
            >
              {year}
            </div>
          ))}
        </div>
        {/* MONTHS */}
        <div className="w-full flex flex-row flex-wrap gap-4 justify-center items-center text-base p-2">
          {timeData[years.indexOf(selectedYear)][selectedYear].map((month) => (
            <div
              key={month}
              onClick={() => handleMonthChange(month)}
              className={`${month == selectedMonth ? "border-b-2" : ""} ${
                theme == "light"
                  ? "border-text-deco-light-mode"
                  : "border-mizuki"
              }`}
            >
              {months[month - 1]}
            </div>
          ))}
        </div>
      </div>
      {/* GACHA BANNERS */}
      <GachaTable filteredBanners={filteredBanners} />
    </div>
  );
}
