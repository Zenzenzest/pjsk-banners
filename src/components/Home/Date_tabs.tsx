import { useState, useEffect } from "react";
import { useServer } from "../../context/Server";
import GachaTable from "./Gacha_table";
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
const currentMonth: string =
  timeData[timeData.length - 1][currentYear][
    timeData[timeData.length - 1][currentYear].length - 1
  ];

export default function DateTabs() {
  const [selectedYear, setSelectedYear] = useState<number>(years.length - 1);
  //   Latest month in the timeData  as  default
  const [selectedMonth, setSelectedMonth] = useState<number>(
    timeData[selectedYear][years[selectedYear]][currentMonth - 1]
  );
  console.log(selectedMonth);

  const handleYearChange = (y: number) => {
    setSelectedYear(y);
    setSelectedMonth(timeData[y][years[y]][0]);
  };
  const handleMonthChange = (m: number) => {
    setSelectedMonth(m);
  };
  return (
    <div className="w-full flex flex-col justify-center items-centers gap-3">
      <div className=" h-12 flex flex-row items-center justify-evenly text-lg pt-5">
        {timeData.map((time, i) => {
          return (
            <div
              className={`${
                years[selectedYear] == Object.keys(time)[0]
                  ? "underline decoration-mizuki"
                  : ""
              }`}
              onClick={() => handleYearChange(i)}
              key={i}
            >
              {Object.keys(time)}
            </div>
          );
        })}
      </div>
      <div className="flex flex-row flex-wrap gap-7 justify-center items-center text-base p-5">
        {timeData[selectedYear][years[selectedYear]].map((month, i) => {
          return (
            <div
              key={month}
              className={`${
                selectedMonth == month ? "underline decoration-mizuki" : ""
              }`}
              onClick={() => handleMonthChange(month)}
            >
              {months[month - 1]}
            </div>
          );
        })}
      </div>
    </div>
  );
}
