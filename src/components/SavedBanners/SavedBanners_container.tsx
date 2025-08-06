import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/Theme_toggle";
import { useServer } from "../../context/Server";
import EnBanners from "../../assets/json/en_banners.json";
import type { BannerTypes } from "../Types";
import BannerContainer from "../BannerContainer/Gacha_container";
import WebsiteDisclaimer from "../Nav/Website_disclaimer";

export default function SavedBannersContainer() {
  const [savedBanners, setSavedBanners] = useState<number[]>([]);
  const { theme } = useTheme();
  const { server } = useServer();
  const savedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSavedBanners = () => {
      const saved = localStorage.getItem("banners");

      if (saved) {
        setSavedBanners(JSON.parse(saved));
      } else {
        setSavedBanners([]);
      }
    };

    updateSavedBanners();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "banners") {
        updateSavedBanners();
      }
    };

    const handleCustomStorageChange = () => {
      updateSavedBanners();
    };

    window.addEventListener("storage", handleStorageChange);

    window.addEventListener("localStorageChanged", handleCustomStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);

      window.removeEventListener(
        "localStorageChanged",

        handleCustomStorageChange
      );
    };
  }, [server]);

  const filteredBanners: BannerTypes[] = EnBanners.filter((banner) => {
    return savedBanners.includes(banner.id);
  }).sort((a, b) => {
    return a.start - b.start;
  });

  return (
    <>
      <div
        className={`h-[75vh] w-full ${
          theme == "dark"
            ? "bg-[#0e1721] text-gray-200"
            : "bg-[#f2f2f2] text-gray-700"
        }`}
      >
        {savedBanners.length >= 1 ? (
          <div>
            <BannerContainer
              filteredBanners={filteredBanners}
              parentRef={savedRef}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4 px-4 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-12 w-12 ${
                theme === "dark" ? "text-gray-500" : "text-gray-400"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <h3 className="text-lg font-medium">
              Your saved banners will appear here
            </h3>
            <p
              className={`max-w-md ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Save banners you want to track by clicking the "Save" button on
              any upcoming banner
            </p>
          </div>
        )}{" "}
        {savedBanners.length >= 1 && <WebsiteDisclaimer />}
      </div>
      {savedBanners.length === 0 && <WebsiteDisclaimer />}
    </>
  );
}
