import { useState, useEffect } from "react";
import GachaBanners from "../../assets/json/gacha_banners.json";
import { useTheme } from "../../context/Theme_toggle";

import { useServer } from "../../context/Server";
import GachaTable from "./Gacha_table";
import type { BannerTypes, GachaBannersProps } from "./types";
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
  { 2021: [12] },
  {
    2022: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
  {
    2023: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
  {
    2024: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
  {
    2025: [1, 2, 3, 4, 5],
  },
];

const currentYear: string = Object.keys(timeData[timeData.length - 1])[0];
const currentMonth: number =
  timeData[timeData.length - 1][currentYear][
    timeData[timeData.length - 1][currentYear].length - 1
  ];

export default function DateTabs() {
  const [selectedYear, setSelectedYear] = useState<number>(
    years[years.length - 1]
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const { theme } = useTheme();

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
      className={`w-full flex flex-col justify-center items-centers gap-3  ${
        theme == "light"
          ? "bg-bg-light-mode2  text-text-light-mode"
          : "bg-bg-dark-mode2"
      }`}
    >
      {/* DATE CONTAINER */}
      <div className="border-b">
        {/* YEARS */}
        <div className=" h-12 flex flex-row items-center justify-evenly text-lg pt-3">
          {years.map((year) => {
            return (
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
            );
          })}
        </div>
        {/* MONTHS */}
        <div className="w-full` flex flex-row flex-wrap gap-4 justify-center items-center text-base p-2 ">
          {timeData[years.indexOf(selectedYear)][selectedYear].map((month) => {
            return (
              <div
                key={month}
                onClick={() => handleMonthChange(month)}
                className={`${month == selectedMonth ? "border-b-2" : ""} ${
                  theme == "light"
                    ? "border-text-deco-light-mode"
                    : "border-mizuki"
                } `}
              >
                {months[month - 1]}
              </div>
            );
          })}
        </div>
      </div>
      {/* GACHA BANNERS */}
      <GachaTable filteredBanners={filteredBanners} />
    </div>
  );
}
