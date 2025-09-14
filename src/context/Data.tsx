import { createContext, useContext, useState, useEffect } from "react";
import type { AllCardTypes, EventTypes, BannerTypes } from "../types/common";
type ProsekaDataContextType = {
  jpEvents: EventTypes[];
  enEvents: EventTypes[];
  allCards: AllCardTypes[];
  jpBanners: BannerTypes[];
  enBanners: BannerTypes[];
  loading: boolean;
  error: string | null;
};

const ProsekaDataContext = createContext<ProsekaDataContextType | undefined>(
  undefined
);

export function ProsekaDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [jpEvents, setJpEvents] = useState<EventTypes[]>([]);
  const [enEvents, setEnEvents] = useState<EventTypes[]>([]);
  const [allCards, setAllCards] = useState<AllCardTypes[]>([]);
  const [jpBanners, setJpBanners] = useState<BannerTypes[]>([]);
  const [enBanners, setEnBanners] = useState<BannerTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mainUrl =
    "https://zenzenzest.github.io/proseka-data/";
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const jpEventRes = await fetch(`${mainUrl}jp_events.json`);
        const enEventRes = await fetch(`${mainUrl}en_events.json`);
        const jpBannerRes = await fetch(`${mainUrl}jp_banners.json`);
        const enBannerRes = await fetch(`${mainUrl}en_banners.json`);

        const allCardsRes = await fetch(`${mainUrl}cards.json`);

        if (
          !jpEventRes.ok ||
          !enEventRes.ok ||
          !jpBannerRes.ok ||
          !enBannerRes.ok ||
          !allCardsRes.ok
        ) {
          throw new Error("Failed to fetch event data");
        }

        const jpEventData = await jpEventRes.json();
        const enEventData = await enEventRes.json();
        const jpBannerData = await jpBannerRes.json();
        const enBannerData = await enBannerRes.json();
        const allCardsData = await allCardsRes.json();
        setJpEvents(jpEventData);
        setEnEvents(enEventData);
        setJpBanners(jpBannerData);
        setEnBanners(enBannerData);
        setAllCards(allCardsData);

        setError(null);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load event data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <ProsekaDataContext.Provider
      value={{
        jpEvents,
        enEvents,
        jpBanners,
        enBanners,
        allCards,
        loading,
        error,
      }}
    >
      {children}
    </ProsekaDataContext.Provider>
  );
}

export function useProsekaData() {
  const context = useContext(ProsekaDataContext);
  if (context === undefined) {
    throw new Error("useEventData must be used within an ProsekaDataProvider");
  }
  return context;
}
