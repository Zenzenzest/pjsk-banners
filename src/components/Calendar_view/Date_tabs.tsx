import { useState, useEffect, useRef } from "react";

import { useTheme } from "../../context/Theme_toggle";
import type { ServerTimeData } from "./DateTabTypes";
import type { BannerTypes } from "../../types/common";
import { useServer } from "../../context/Server";
import BannerContainer from "../BannerContainer/Banner_Container";
import WebsiteDisclaimer from "../Server/Website_disclaimer";
import {
  months,
  years_global,
  timeData_global,
  years_jp,
  timeData_jp,
} from "./Date_tabs_constants";
import { useProsekaData } from "../../context/Data";

export default function DateTabs() {
  const { theme } = useTheme();
  const { server } = useServer();
  const { enBanners, jpBanners } = useProsekaData();
  const dateTabsRef = useRef<HTMLDivElement>(null);
  const yearScrollRef = useRef<HTMLDivElement>(null);

  const years = server === "global" ? years_global : years_jp;
  const timeData = server === "global" ? timeData_global : timeData_jp;
  const dataBanners = server === "global" ? enBanners : jpBanners;

  const currentDate = new Date();
  const currentYearValue = currentDate.getFullYear();
  const currentMonthValue = currentDate.getMonth() + 1;

  // Get values based on selected server
  const getDefaultValues = () => {
    const getInitialYear = (serverYears: number[]) => {
      if (serverYears.includes(currentYearValue)) {
        return currentYearValue;
      }
      for (let i = serverYears.length - 1; i >= 0; i--) {
        if (serverYears[i] <= currentYearValue) {
          return serverYears[i];
        }
      }
      return serverYears[0];
    };

    const getInitialMonth = (
      year: number,
      serverYears: number[],
      serverTimeData: ServerTimeData[]
    ) => {
      const yearIndex = serverYears.indexOf(year);
      const availableMonths = serverTimeData[yearIndex][year];

      if (year === currentYearValue) {
        if (availableMonths.includes(currentMonthValue)) {
          return currentMonthValue;
        }
        for (let i = availableMonths.length - 1; i >= 0; i--) {
          if (availableMonths[i] <= currentMonthValue) {
            return availableMonths[i];
          }
        }
      }
      // select the latest available month for future year
      return availableMonths[availableMonths.length - 1];
    };

    const defaultYear = getInitialYear(years);
    const defaultMonth = getInitialMonth(defaultYear, years, timeData);
    return { defaultYear, defaultMonth };
  };

  const { defaultYear, defaultMonth } = getDefaultValues();
  const [selectedYear, setSelectedYear] = useState<number>(defaultYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(defaultMonth);
  const [yearMonthMemory, setYearMonthMemory] = useState<
    Record<number, number>
  >({});

  // Auto-scroll to selected year on
  // For mobile because mobile screen small
  // Current year don't show up so need scroll
  const scrollToSelectedYear = () => {
    if (yearScrollRef.current && selectedYear) {
      const selectedButton = yearScrollRef.current.querySelector(
        `button[data-year="${selectedYear}"]`
      ) as HTMLElement;

      if (selectedButton) {
        const container = yearScrollRef.current;
        const containerRect = container.getBoundingClientRect();
        const buttonRect = selectedButton.getBoundingClientRect();

        const scrollLeft =
          selectedButton.offsetLeft -
          containerRect.width / 2 +
          buttonRect.width / 2;

        container.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        });
      }
    }
  };

  useEffect(() => {
    const { defaultYear: newDefaultYear, defaultMonth: newDefaultMonth } =
      getDefaultValues();
    setSelectedYear(newDefaultYear);
    setSelectedMonth(newDefaultMonth);
    setYearMonthMemory({ [newDefaultYear]: newDefaultMonth });
  }, [server]);

  // Auto-scroll when selectedYear changes
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToSelectedYear();
    }, 100); // ensure DOM is updated as usual

    return () => clearTimeout(timer);
  }, [selectedYear, server]);

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
      const startDate = new Date(Number(banner.start));
      const endDate = new Date(Number(banner.end));
      const now = Date.now();

      const selectedDate = new Date(selectedYear, selectedMonth - 1, 1);
      const nextMonth = new Date(selectedYear, selectedMonth, 1);

      const bannerStartsInMonth =
        startDate >= selectedDate && startDate < nextMonth;

      const isCurrentMonth =
        selectedYear === currentYearValue &&
        selectedMonth === currentMonthValue;

      const bannerIsOngoingInMonth =
        startDate < selectedDate && endDate >= selectedDate;
      const bannerIsLive =
        Number(banner.start) <= now && now <= Number(banner.end);

      const shouldShowOngoing =
        bannerIsOngoingInMonth && bannerIsLive && isCurrentMonth;

      return bannerStartsInMonth || shouldShowOngoing;
    })
    .sort((a, b) => {
      const statusA = getBannerStatus(a);
      const statusB = getBannerStatus(b);
      const statusOrder = { live: 1, upcoming: 2, past: 3 };
      const statusComparison = statusOrder[statusA] - statusOrder[statusB];
      if (statusComparison !== 0) return statusComparison;

      // priority levels for live banners
      const getPriority = (banner: BannerTypes) => {
        if ("event_id" in banner) return 1;
        if (banner.banner_type === "Bloom Festival") return 2;
        if (banner.banner_type === "Limited Collab") return 3;
        if (banner.banner_type === "Birthday") return 4;
        if (banner.banner_type === "Limited Event Rerun") return 5;

        if (
          banner.banner_type === "Premium Gift" ||
          banner.banner_type === "Unit Premium Gift"
        )
          return 7;
        return 6;
      };

      if (statusA === "live" && statusB === "live") {
        const priorityA = getPriority(a);
        const priorityB = getPriority(b);
        if (priorityA !== priorityB) return priorityA - priorityB;
      }

      // Keep the rerun comparison for non-live banners or when priorities are equal
      const rerunComparison = Number("rerun" in a) - Number("rerun" in b);
      if (rerunComparison !== 0) return rerunComparison;

      return Number(a.start) - Number(b.start);
    });

  const handleYearChange = (y: number) => {
    const yearIndex = years.indexOf(y);
    const availableMonths = timeData[yearIndex][y];
    const rememberedMonth = yearMonthMemory[y];

    setSelectedYear(y);

    // If we have a remembered month for this year, use it
    if (rememberedMonth && availableMonths.includes(rememberedMonth)) {
      setSelectedMonth(rememberedMonth);
      return;
    }

    // For future years, select the latest available month
    if (y > currentYearValue) {
      setSelectedMonth(availableMonths[availableMonths.length - 1]);
    } else {
      // For current/past years, use the first available month
      setSelectedMonth(availableMonths[0]);
    }
  };

  const handleMonthChange = (m: number) => {
    setSelectedMonth(m);
    setYearMonthMemory((prev) => ({
      ...prev,
      [selectedYear]: m,
    }));
  };

  return (
    <div
      ref={dateTabsRef}
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-1 pt-3 max-sm:px-2">
        {/* YEAR */}
        <div className="mb-4">
          <div
            className={`p-4 rounded-xl ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } shadow-sm border ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <h2
              className={`text-sm font-medium mb-3 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Select Year
            </h2>
            <div
              ref={yearScrollRef}
              className="flex overflow-x-auto pb-2 hide-scrollbar scroll-smooth"
            >
              <div className="flex space-x-1">
                {years.map((year) => (
                  <button
                    key={year}
                    data-year={year}
                    onClick={() => handleYearChange(year)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                      year === selectedYear
                        ? theme === "dark"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "bg-blue-100 text-blue-700 border border-blue-200"
                        : theme === "dark"
                        ? "hover:bg-gray-700/50 text-gray-300"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* MONTHS */}
        <div className="mb-4">
          <div
            className={`p-4 rounded-xl ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } shadow-sm border ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <h2
              className={`text-sm font-medium mb-3 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Select Month
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2">
              {years.includes(selectedYear) &&
                timeData[years.indexOf(selectedYear)][selectedYear]?.map(
                  (month) => (
                    <button
                      key={month}
                      onClick={() => handleMonthChange(month)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        month === selectedMonth
                          ? theme === "dark"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : "bg-blue-100 text-blue-700 border border-blue-200"
                          : theme === "dark"
                          ? "hover:bg-gray-700/50 text-gray-300"
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      {months[month - 1]}
                    </button>
                  )
                )}
            </div>
          </div>
        </div>

        {/* BANNERS */}
        <BannerContainer
          filteredBanners={filteredBanners}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          parentRef={dateTabsRef}
        />
      </div>
      <WebsiteDisclaimer />
    </div>
  );
}
