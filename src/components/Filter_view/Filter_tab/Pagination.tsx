import { useTheme } from "../../../context/Theme_toggle";
import type { PaginationProps } from "../FilterTabTypes";

export default function Pagination({
  currentPage,
  totalPages,
  handlePageChange,
}: PaginationProps) {
  const { theme } = useTheme();

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-5 px-4">
      <div
        className={`text-sm mb-2 sm:hidden ${
          theme === "light" ? "text-gray-600" : "text-gray-400"
        }`}
      >
        Page {currentPage} of {totalPages}
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        {/* PREVIOUS BUTTON */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-2 py-2 sm:px-3 text-sm rounded ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-opacity-80 active:scale-95"
          } ${
            theme === "dark"
              ? "bg-gray-700 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">‹</span>
        </button>

        {/* PAGE NUMBERS - HIDDEN IN MOBILE*/}
        <div className="flex items-center gap-1">
          {generatePageNumbers().map((page, index) => {
            // ON MOBILE - ONLY SHOW CURRENT PAGE
            const isMobile = window.innerWidth < 640;
            const shouldShowOnMobile =
              !isMobile ||
              page === currentPage ||
              page === currentPage - 1 ||
              page === currentPage + 1 ||
              page === 1 ||
              page === totalPages ||
              page === "...";

            if (isMobile && !shouldShowOnMobile) return null;

            return (
              <button
                key={index}
                onClick={() =>
                  typeof page === "number" && handlePageChange(page)
                }
                disabled={page === "..."}
                className={`px-2 py-2 sm:px-3 text-sm rounded min-w-[32px] sm:min-w-[36px] ${
                  page === currentPage
                    ? theme === "dark"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-500 text-white"
                    : page === "..."
                    ? "cursor-default"
                    : theme === "dark"
                    ? "bg-gray-700 text-white hover:bg-gray-600 active:scale-95"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300 active:scale-95"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* NEXT BUTTOn*/}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-2 py-2 sm:px-3 text-sm rounded ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-opacity-80 active:scale-95"
          } ${
            theme === "dark"
              ? "bg-gray-700 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          <span className="hidden sm:inline">Next</span>
          <span className="sm:hidden">›</span>
        </button>
      </div>
    </div>
  );
}
