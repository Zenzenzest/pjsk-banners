import { useCallback } from "react";
import JpBanners from "../assets/json/jp_banners.json";

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
  const hostUrl = "https://r2-image-proxy.zenzenzest.workers.dev";

  const getBannerImageUrl = useCallback(() => {
    if (mode === "gacha") {
      return server === "global" || server === "saved"
        ? `${hostUrl}/en_banners/${banner.id}.webp`
        : `${hostUrl}/jp_banners/${banner.id}.webp`;
    } else {
      return server === "global" || server === "saved"
        ? `${hostUrl}/en_events/${banner.event_id}.webp`
        : `${hostUrl}/jp_events/${banner.event_id}.webp`;
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
          const jp_variant = JpBanners.find((item) => item.en_id == en_id);
          target.src = jp_variant
            ? `${hostUrl}/jp_banners/${jp_variant.id}.webp`
            : `${hostUrl}/en_banners/placeholder.jpg`;
        } else {
          target.src = `${hostUrl}/en_banners/placeholder.jpg`;
        }
      } else {
        const event_id = Number(target.alt);
        target.src = `${hostUrl}/jp_events/${event_id}.webp`;
      }
    },
    [mode, server]
  );

  return {
    bannerImageUrl: getBannerImageUrl(),
    handleImageError,
  };
};
