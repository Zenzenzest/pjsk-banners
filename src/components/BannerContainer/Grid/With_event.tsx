import { useServer } from "../../../context/Server";
import { useTheme } from "../../../context/Theme_toggle";
import CountdownTimer from "../Timers/Countdown_timer";
import EventEndedTimer from "../Timers/EventEnded_timer";
import JpEvents from "../../../assets/json/jp_events.json";
import EnEvents from "../../../assets/json/en_events.json";
import JpBanners from "../../../assets/json/jp_banners.json";
import BannerCards from "../Cards/Banner_cards";
import EventCards from "../Cards/Event_cards";
import BannerStatus from "../Status";
import { ImageLoader } from "../../../hooks/imageLoader";
import type { WithEventProps } from "../BannerTypes";

export default function WithEvent({
  mode,
  banner,
  handleCardClick,
  handleSaveBanner,
  handleEventClick,
  handleGachaClick,
  isBannerSaved,
}: WithEventProps) {
  const { theme } = useTheme();
  const { server } = useServer();
  const bannerLoader = ImageLoader(1);
  const today = Date.now();

  const EventObj =
    (server === "global" || server === "saved") && mode === "event"
      ? EnEvents.find((item) => item.id === banner.event_id)
      : JpEvents.find((item) => item.id === banner.event_id);

  // Null check EventObj
  if (mode === "event" && !EventObj) {
    return (
      <div className="p-4 text-red-500">
        Error: Event not found for ID {banner.event_id}
      </div>
    );
  }

  const getBannerStatus = (item: { start: number; end: number }) => {
    const now = Date.now();
    const start = Number(item.start);
    const end = Number(item.end);
    if (now < start) return "upcoming";
    if (now > end) return "ended";
    return "active";
  };

  const bannerStatus = getBannerStatus(mode === "gacha" ? banner : EventObj!);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return theme === "dark"
          ? "bg-blue-500/60 text-gray-100 border-blue-500/20"
          : "bg-blue-50 text-blue-700 border-blue-200";
      case "active":
        return theme === "dark"
          ? "bg-green-500/60 text-gray-100 border-green-500/20"
          : "bg-green-50 text-green-700 border-green-200";
      case "ended":
        return theme === "dark"
          ? "bg-gray-500/60 text-gray-100 border-gray-500/20"
          : "bg-gray-50 text-gray-600 border-gray-200";
      default:
        return "";
    }
  };

  const statusColor = getStatusColor(bannerStatus);

  // Calculate bannerShopCards inside
  const bannerShopCards = banner.event_id
    ? (server === "global" ? EnEvents : JpEvents)
        .find((item) => item.id == banner.event_id)
        ?.cards.filter((eventCard) => !banner.cards.includes(eventCard)) || []
    : [];

  // Calculate dates and formatted strings inside
  const startDate = new Date(
    Number(mode === "gacha" ? banner.start : EventObj!.start)
  );
  const endDate = new Date(
    Number(mode === "gacha" ? banner.end : EventObj!.end)
  );

  const formattedStart = startDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const formattedEnd = endDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const gachaBannerImage =
    mode === "gacha"
      ? server === "global" || server === "saved"
        ? `/images/banners/${banner.id}.webp`
        : `/images/jp_banners/${banner.id}.webp`
      : server === "global" || server === "saved"
      ? `/images/en_events/${banner.event_id}.webp`
      : `/images/jp_events/${banner.event_id}.webp`;

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    if (mode === "gacha") {
      const target = e.currentTarget;
      target.onerror = null;
      const en_id = Number(target.alt);
      if (server === "global" || server === "saved") {
        const jp_variant = JpBanners.find((item) => item.en_id == en_id);
        target.src = jp_variant
          ? `/images/jp_banners/${jp_variant.id}.webp`
          : "/images/banners/placeholder.jpg";
      } else {
        target.src = "/images/banners/placeholder.jpg";
      }
    } else {
      const target = e.currentTarget;
      target.onerror = null;
      const event_id = Number(target.alt);
      target.src = `/images/jp_events/${event_id}.webp`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative group">
        <div className="overflow-hidden rounded-sm sm:rounded-xl ">
          {!bannerLoader.isLoaded && (
            <div className="animate-pulse bg-gray-300 dark:bg-gray-600 aspect-[359/152] w-full rounded-lg" />
          )}
          {/* BANNER / EVENT IMAGE */}
          <div
            className={`relative ${
              bannerLoader.isLoaded ? "contents" : "hidden"
            }`}
          >
            <img
              src={gachaBannerImage}
              alt={
                mode === "gacha"
                  ? banner.id.toString()
                  : banner.event_id?.toString()
              }
              fetchPriority="high"
              className={`w-full h-auto ${
                EventObj?.event_type !== "login" &&
                banner.banner_type !== "Birthday" &&
                "cursor-pointer   duration-200 hover:scale-105 hover:opacity-80"
              }`}
              onError={handleImageError}
              onLoad={bannerLoader.handleLoad}
              onClick={
                mode === "event" &&
                EventObj?.event_type !== "login" &&
                banner.event_id !== undefined
                  ? () => handleEventClick(banner.event_id)
                  : banner.banner_type !== "Birthday" &&
                    EventObj?.event_type !== "login" &&
                    mode === "gacha"
                  ? () => handleGachaClick(banner.sekai_id)
                  : undefined
              }
            />
          </div>
        </div>
        <BannerStatus bannerStatus={bannerStatus} statusColor={statusColor} />
      </div>
      {/* NAME AND TYPE */}
      <div className="space-y-3">
        <div>
          <h3
            className={`text-xs sm:text-sm truncate md:text-md font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {mode === "gacha" ? banner.name : EventObj!.name}
          </h3>
          <p
            className={`text-xs sm:text-sm truncate ${
              theme === "dark" ? "text-gray-300" : "text-gray-500"
            }`}
          >
            {mode === "gacha" ? banner.banner_type : EventObj!.type}
          </p>
        </div>
        {/* BANNER CONFIRMED BADGE */}
        {banner.type === "confirmed" && (
          <div className="flex items-center w-auto max-w-[300px] space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>{banner.confirmation}</span>
          </div>
        )}
        {banner.type === "questionable" && (
          <div className="flex items-center w-auto max-w-[300px] space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>{banner.tag}</span>
          </div>
        )}
        {/* CARDS */}
        {mode === "gacha" ? (
          <BannerCards banner={banner} handleCardClick={handleCardClick} />
        ) : (
          <EventCards
            bannerCards={banner.cards}
            bannerShopCards={bannerShopCards}
            handleCardClick={handleCardClick}
          />
        )}
        {/* DATE RANGE */}
        {banner.type !== "confirmed" &&
          banner.type !== "rerun_estimation" &&
          banner.event_id && (
            <div className="flex flex-col gap-2">
              <div
                className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-xs sm:text-sm">
                  Start: {formattedStart}
                </span>
              </div>
              <div
                className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-xs sm:text-sm">End: {formattedEnd}</span>
              </div>
            </div>
          )}
        {/* COUNTDOWN */}
        {banner.event_id && (
          <div>
            {/* COUNTDOWN TIMER */}
            {today <
              Number(mode === "gacha" ? banner.start : EventObj!.start) &&
              banner.type !== "confirmed" &&
              banner.type !== "rerun_estimation" &&
              banner.event_id && (
                <div className="flex justify-center">
                  <CountdownTimer targetDate={startDate} mode="start" />
                </div>
              )}
            {/* RERUN ESTIMATION */}
            {banner.type === "rerun_estimation" && banner.rerun && (
              <div className="flex justify-center">
                <div
                  className={`px-4 py-2 rounded-xl font-medium ${
                    theme === "dark"
                      ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}
                >
                  In {Math.floor((banner.rerun[0] - today) / 86400000)} -{" "}
                  {Math.floor((banner.rerun[1] - today) / 86400000)} Days
                </div>
              </div>
            )}
            {/* ACTIVE/ENDED STATUS */}
            {today > Number(mode === "gacha" ? banner.end : EventObj!.end) && (
              <div className="flex justify-center">
                <EventEndedTimer endDate={endDate} />
              </div>
            )}
            {today >
              Number(mode === "gacha" ? banner.start : EventObj!.start) &&
              today < Number(mode === "gacha" ? banner.end : EventObj!.end) && (
                <div className="flex justify-center">
                  {endDate.getTime() < 2000000000000 && (
                    <CountdownTimer targetDate={endDate} mode="end" />
                  )}
                </div>
              )}
          </div>
        )}
        {/* SAVE BUTTON */}
        {(server === "global" || server === "saved") &&
          (today < banner.start || isBannerSaved(banner.id)) &&
          mode === "gacha" &&
          banner.event_id && (
            <button
              onClick={() => handleSaveBanner(banner.id)}
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isBannerSaved(banner.id)
                  ? theme === "dark"
                    ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                    : "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                  : theme === "dark"
                  ? "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20"
                  : "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
              }`}
            >
              {isBannerSaved(banner.id) ? (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span>Remove from Saved</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                  <span>Save Banner</span>
                </>
              )}
            </button>
          )}
      </div>
    </div>
  );
}
