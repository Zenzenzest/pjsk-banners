import { useState, useEffect } from "react";
import { useServer } from "../../../context/Server";
import type { GridProps } from "../BannerTypes";
import JpEvents from "../../../assets/json/jp_events.json";
import EnEvents from "../../../assets/json/en_events.json";
import WithEvent from "./With_event";
import WithoutEvent from "./Without_event";

export default function Grid({
  banner,
  mode,
  handleCardClick,
  handleEventClick
}: GridProps) {
  const [savedBanners, setSavedBanners] = useState<number[]>([]);
  const { server } = useServer();

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

    // custom storage events
    const handleStorageChange = () => {
      loadSavedBanners();
    };

    window.addEventListener("localStorageChanged", handleStorageChange);

    return () => {
      window.removeEventListener("localStorageChanged", handleStorageChange);
    };
  }, [banner]);

  const handleSaveBanner = (id: number) => {
    // Get fresh data from localStorage to avoid stale state
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

    // Update localStorage
    localStorage.setItem("banners", JSON.stringify(updatedBanners));

    // Update local state
    setSavedBanners(updatedBanners);

    // dispatch custom event to notify other components
    window.dispatchEvent(new Event("localStorageChanged"));
  };

  // Null check for EventObj
  const EventObj =
    (server === "global" || server === "saved") && mode === "event"
      ? EnEvents.find((item) => item.id === banner.event_id)
      : JpEvents.find((item) => item.id === banner.event_id);

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
      {/* BANNER + EVENT */}

      <WithEvent
        mode={mode}
        banner={banner}
        handleCardClick={handleCardClick}
        handleSaveBanner={handleSaveBanner}
        isBannerSaved={isBannerSaved}
        handleEventClick={handleEventClick}
      />

      {/* SOLO */}
      {/* GACHA BANNERS THAT DONT HAVE EVENT WITH IT */}
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
