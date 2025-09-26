import { useState, useEffect } from "react";
import { useServer } from "../../../context/Server";
import { useProsekaData } from "../../../context/Data";
import type { GridProps } from "../BannerTypes";
import WithEvent from "./With_event";
import WithoutEvent from "./Without_event";
import { GetCurrentPath } from "../../../constants/common";

export default function Grid({
  banner,
  mode,
  handleCardClick,
  handleEventClick,
  handleGachaClick,
}: GridProps) {
  const [savedBanners, setSavedBanners] = useState<number[]>([]);
  const { server } = useServer();
  const { jpEvents, enEvents } = useProsekaData();
  const location = GetCurrentPath();
  useEffect(() => {
    const loadSavedBanners = () => {
      const saved = localStorage.getItem("banners");
      if (saved) {
        try {
          setSavedBanners(JSON.parse(saved));
        } catch (error) {
          console.error("Error parsing saved banners:", error);
          setSavedBanners([]);
        }
      } else {
        setSavedBanners([]);
      }
    };

    loadSavedBanners();

    const handleStorageChange = () => {
      loadSavedBanners();
    };

    window.addEventListener("localStorageChanged", handleStorageChange);

    return () => {
      window.removeEventListener("localStorageChanged", handleStorageChange);
    };
  }, [banner]);

  const handleSaveBanner = (id: number) => {
    const currentSaved = localStorage.getItem("banners");
    let currentSavedArray: number[] = [];

    if (currentSaved) {
      try {
        currentSavedArray = JSON.parse(currentSaved);
      } catch (error) {
        console.error("Error parsing current saved banners:", error);
        currentSavedArray = [];
      }
    }

    let updatedBanners: number[];
    if (currentSavedArray.includes(id)) {
      updatedBanners = currentSavedArray.filter((item) => item !== id);
    } else {
      updatedBanners = [...currentSavedArray, id];
    }

    localStorage.setItem("banners", JSON.stringify(updatedBanners));
    setSavedBanners(updatedBanners);
    window.dispatchEvent(new Event("localStorageChanged"));
  };

  const EventObj =
    (server === "global" || location === "/saved") && mode === "event"
      ? enEvents.find((item) => item.id === banner.event_id)
      : jpEvents.find((item) => item.id === banner.event_id);

  if (mode === "event" && !EventObj) {
    return (
      <div className="p-4 text-red-500">
        Error: Event not found for ID {banner.event_id}
      </div>
    );
  }

  const isBannerSaved = (id: number) => savedBanners.includes(id);

  return (
    <div
      className={`${
        !banner.event_id && "grid grid-cols-1 sm:grid-cols-2 gap-3"
      }`}
    >
      <WithEvent
        mode={mode}
        banner={banner}
        handleCardClick={handleCardClick}
        handleSaveBanner={handleSaveBanner}
        isBannerSaved={isBannerSaved}
        handleEventClick={handleEventClick}
        handleGachaClick={handleGachaClick}
      />

      {!banner.event_id && (
        <WithoutEvent
          banner={banner}
          handleSaveBanner={handleSaveBanner}
          isBannerSaved={isBannerSaved}
        />
      )}
    </div>
  );
}
