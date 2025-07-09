const GachaTableSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Skeleton for each banner */}
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-2xl border animate-pulse"
        >
          {/* Banner Status Badge */}
          <div className="absolute top-4 right-4 z-10">
            <div className="px-3 py-1 rounded-full bg-gray-600 w-20 h-6"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Banner Info Section */}
            <div className="space-y-4">
              {/* Banner Image */}
              <div className="relative group">
                <div className="overflow-hidden rounded-xl bg-gray-600 h-48 w-full"></div>
              </div>
              {/* Banner Details */}
              <div className="space-y-3">
                <div className="h-6 w-48 bg-gray-600 rounded"></div>
                <div className="h-4 w-32 bg-gray-600 rounded"></div>
              </div>
              {/* Date Range */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-gray-600 w-32 h-8"></div>
                <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-gray-600 w-32 h-8"></div>
              </div>
              {/* Save Button */}
              <div className="w-36 h-10 bg-gray-600 rounded-lg"></div>
            </div>
            {/* Cards Section */}
            <div className="space-y-4">
              {/* Countdown Timer */}
              <div className="flex justify-center">
                <div className="px-4 py-2 rounded-xl bg-gray-600 w-40 h-10"></div>
              </div>
              {/* Gacha Cards */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-xl bg-gray-600 h-20 w-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GachaTableSkeleton;
