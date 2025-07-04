import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/Theme_toggle";
import { useServer } from "../../context/Server";
import EnBanners from "../../assets/json/en_banners.json";
import type { BannerTypes } from "../Home/Types";
import GachaTable from "../Shared/Gacha_table";

export default function SavedCardsContainer() {
  const [savedBanners, setSavedBanners] = useState<number[]>([]);
  const { theme } = useTheme();
  const { server, setServer } = useServer();
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

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "banners") {
        updateSavedBanners();
      }
    };

    // Listen for custom storage events (for same-tab updates)
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
        theme == "dark" ? "bg-[#0e1721]" : "bg-[#f2f2f2]"
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
