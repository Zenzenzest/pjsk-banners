import type { BannerStatusProps } from "./BannerTypes";

export default function BannerStatus({
  bannerStatus,
  statusColor,
}: BannerStatusProps) {
  return (
    <div className="absolute top-[-5px] right-[-5px] max-h-[20px]">
      <span
        className={` px-1 py-1  rounded-full text-xs font-medium border ${statusColor} backdrop-blur-sm`}
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
