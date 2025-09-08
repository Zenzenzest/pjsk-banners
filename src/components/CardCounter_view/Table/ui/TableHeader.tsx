import type { SortColumn, TableHeaderProps } from "../CounterTableTypes";

export default function TableHeader({
  handleSort,
  getSortIndicator,
}: TableHeaderProps) {
  const columns: {
    key: SortColumn;
    label: string;
    sticky?: boolean;
    width?: string;
    color?: string;
  }[] = [
    { key: "character", label: "Char", sticky: true, width: "w-20" },
    { key: "total", label: "Total", sticky: false },
    {
      key: "4-limited",
      label: "4★ Lim",
      sticky: false,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      key: "4-permanent",
      label: "4★ Perm",
      sticky: false,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      key: "3-permanent",
      label: "3★",
      sticky: false,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      key: "2-permanent",
      label: "2★",
      sticky: false,
      color: "text-pink-600 dark:text-pink-400",
    },
  ];

  //   separate last cards handling because no sort needed
  const lastColumns = [
    { label: "Last 4★ Lim" },
    { label: "Last 4★ Perm" },
    { label: "Last 3★" },
    { label: "Last 2★" },
  ];

  return (
    <thead className="sticky top-0 z-20">
      <tr className="bg-gray-50 dark:bg-gray-700">
        {columns.map((column) => (
          <th
            key={column.key}
            className={`
               text-xs font-medium uppercase tracking-wider
              ${
                column.sticky
                  ? "sticky left-0 bg-gray-50 dark:bg-gray-700 px-2 w-20"
                  : "text-center"
              }
              ${column.color || "text-gray-500 dark:text-gray-300"}
              cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-0
            `}
            onClick={(e) => handleSort(column.key, e)}
            tabIndex={-1}
          >
            <div
              className={`
              flex items-center
              ${column.sticky ? "" : "justify-center"}
            `}
            >
              {column.label}
              {getSortIndicator(column.key)}
            </div>
          </th>
        ))}
        {lastColumns.map((column, index) => (
          <th
            key={index}
            className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}
