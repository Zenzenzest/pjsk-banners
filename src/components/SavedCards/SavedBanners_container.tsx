import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/Theme_toggle";
import { useServer } from "../../context/Server";
import EnBanners from "../../assets/json/en_banners.json";
import type { BannerTypes } from "../Global/Types";
import GachaTable from "../Shared/Gacha_table";

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

    // Detect storage changed
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "banners") {
        updateSavedBanners();
      }
    };

    // detect custom storage events (for same-tab updates)
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

  const filteredBanners: BannerTypes[] = EnBanners.filter((banner) =>
    savedBanners.includes(banner.id)
  );

  return (
    <div
      className={`h-dvh w-full ${
        theme == "dark"
          ? "bg-[#0e1721] text-gray-200"
          : "bg-[#f2f2f2] text-gray-700"
      }`}
    >
      {savedBanners.length >= 1 ? (
        <div>
          <GachaTable filteredBanners={filteredBanners} parentRef={savedRef} />
        </div>
      ) : (
        <div>YOU HAVENT SAVED ANY BANNERS YET MF</div>
      )}
    </div>
  );
}
