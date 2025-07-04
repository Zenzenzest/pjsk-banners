import { useState, useEffect } from "react";
import { useTheme } from "../../context/Theme_toggle";
import { useServer } from "../../context/Server";

export default function SavedCardsContainer() {
  const [savedBanners, setSavedBanners] = useState<number[]>([]);
  const { theme } = useTheme();
  const { server, setServer } = useServer();
  useEffect(() => {
    setServer("saved");
    const saved = localStorage.getItem("banners");
    if (saved) {
      setSavedBanners(JSON.parse(saved));
    }
    console.log(saved);
  }, [server]);
  
  return (
    <div>
      {savedBanners.length >= 1 ? (
        <div>NICE</div>
      ) : (
        <div>YOU HAVENT SAVED ANY BANNERS YET MF</div>
      )}
    </div>
  );
}
