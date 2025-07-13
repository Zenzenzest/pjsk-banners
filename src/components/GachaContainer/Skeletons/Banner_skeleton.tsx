import { useTheme } from "../../../context/Theme_toggle";

interface BannerTemplateSkeletonProps {
  hasEventId?: boolean;
  showSaveButton?: boolean;
  showConfirmedBadge?: boolean;
  showRerunEstimation?: boolean;
  showDateRange?: boolean;
}

export default function BannerTemplateSkeleton({
  hasEventId = true,
  showSaveButton = false,
  showConfirmedBadge = false,
  showRerunEstimation = false,
  showDateRange = true,
}: BannerTemplateSkeletonProps) {
  const { theme } = useTheme();

  const skeletonClass = theme === "dark" 
    ? "bg-gray-700 animate-pulse" 
    : "bg-gray-200 animate-pulse";

  return (
    <div className={`${!hasEventId && "grid grid-cols-1 sm:grid-cols-2 gap-3"}`}>
      {/* BANNER + EVENT */}
      <div className="space-y-4">
        <div className="relative group">
          {/* Banner Image Skeleton */}
          <div className="overflow-hidden rounded-sm sm:rounded-xl">
            <div className={`w-full h-32 sm:h-40 md:h-48 ${skeletonClass}`} />
          </div>
          
          {/* Banner Status Skeleton */}
          <div className="absolute top-2 right-2">
            <div className={`w-16 h-6 rounded-full ${skeletonClass}`} />
          </div>
        </div>

        <div className="space-y-3">
          {/* Title and Type Skeleton */}
          <div>
            <div className={`h-4 sm:h-5 w-3/4 rounded ${skeletonClass} mb-1`} />
            <div className={`h-3 sm:h-4 w-1/2 rounded ${skeletonClass}`} />
          </div>

          {/* Confirmed Badge Skeleton */}
          {showConfirmedBadge && (
            <div className={`h-8 w-48 rounded-full ${skeletonClass}`} />
          )}

          {/* Cards Skeleton - Placeholder for actual card skeletons */}
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className={`w-12 h-16 sm:w-14 sm:h-18 rounded ${skeletonClass}`}
              />
            ))}
          </div>

          {/* Date Range Skeleton */}
          {showDateRange && hasEventId && (
            <div className="flex flex-col gap-2">
              <div className={`h-8 w-40 rounded-lg ${skeletonClass}`} />
              <div className={`h-8 w-40 rounded-lg ${skeletonClass}`} />
            </div>
          )}

          {/* Countdown/Timer Skeleton */}
          <div className="flex justify-center">
            {showRerunEstimation ? (
              <div className={`h-10 w-32 rounded-xl ${skeletonClass}`} />
            ) : (
              <div className={`h-12 w-48 rounded-lg ${skeletonClass}`} />
            )}
          </div>

          {/* Save Button Skeleton */}
          {showSaveButton && (
            <div className={`h-10 w-36 rounded-lg ${skeletonClass}`} />
          )}
        </div>
      </div>

      {/* SOLO Layout (when no event_id) */}
      {!hasEventId && (
        <div className="space-y-4">
          {/* Date Range Skeleton for Solo */}
          {showDateRange && (
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <div className={`h-8 w-32 rounded-lg ${skeletonClass}`} />
              <div className={`h-8 w-32 rounded-lg ${skeletonClass}`} />
            </div>
          )}

          {/* Countdown/Timer Skeleton for Solo */}
          <div className="flex">
            {showRerunEstimation ? (
              <div className={`h-10 w-32 rounded-xl ${skeletonClass}`} />
            ) : (
              <div className={`h-12 w-48 rounded-lg ${skeletonClass}`} />
            )}
          </div>

          {/* Save Button Skeleton for Solo */}
          {showSaveButton && (
            <div className={`h-10 w-36 rounded-lg ${skeletonClass}`} />
          )}
        </div>
      )}
    </div>
  );
}