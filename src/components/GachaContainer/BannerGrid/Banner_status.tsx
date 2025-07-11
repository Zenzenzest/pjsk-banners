import type { BannerStatusProps } from "../Gacha_types";

export default function BannerStatus({
  bannerStatus,
  statusColor,
}: BannerStatusProps) {
  return (
    <div className="absolute top-0 right-0 z-10">
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColor} backdrop-blur-sm`}
      >
        {bannerStatus === "upcoming"
          ? "Upcoming"
          : bannerStatus === "active"
          ? "Active"
          : "Ended"}
      </span>
    </div>
  );
}
