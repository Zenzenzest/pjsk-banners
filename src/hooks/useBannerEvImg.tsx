import { useCallback } from "react";
import { useProsekaData } from "../context/Data";
import { imgHost } from "../constants/common";
type UseBannerImageProps = {
  mode: string | undefined;
  server: string;
  banner: {
    id: number;
    event_id?: number;
  };
};

export const useBannerEvImg = ({
  mode,
  server,
  banner,
}: UseBannerImageProps) => {
  const { jpBanners } = useProsekaData();


  const getBannerImageUrl = useCallback(() => {
    if (mode === "gacha") {
      return server === "global" || server === "saved"
        ? `${imgHost}/en_banners/${banner.id}.webp`
        : `${imgHost}/jp_banners/${banner.id}.webp`;
    } else {
      return server === "global" || server === "saved"
        ? `${imgHost}/en_events/${banner.event_id}.webp`
        : `${imgHost}/jp_events/${banner.event_id}.webp`;
    }
  }, [mode, server, banner.id, banner.event_id]);

  // using jp image as a fallback
  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const target = e.currentTarget;
      target.onerror = null;

      if (mode === "gacha") {
        const en_id = Number(target.alt);
        if (server === "global" || server === "saved") {
          const jp_variant = jpBanners.find((item) => item.en_id == en_id);
          target.src = jp_variant
            ? `${imgHost}/jp_banners/${jp_variant.id}.webp`
            : `${imgHost}/en_banners/placeholder.jpg`;
          if (Number(target.alt) === 514) {
            console.log(jpBanners);
          }
        } else {
          target.src = `${imgHost}/en_banners/placeholder.jpg`;
        }
      } else {
        const event_id = Number(target.alt);
        target.src = `${imgHost}/jp_events/${event_id}.webp`;
      }
    },
    [mode, server]
  );

  return {
    bannerImageUrl: getBannerImageUrl(),
    handleImageError,
  };
};
