import { useServer } from "../../../context/Server";
import { useTheme } from "../../../context/Theme_toggle";
import WebsiteDisclaimer from "../../Nav/Website_disclaimer";
import CardModal from "../../Modal/Card/Card_modal";
import { useCardTable } from "./hooks/useCardTable";

import FilterControls from "./ui/FilterControls";
import TableHeader from "./ui/TableHeader";
import TableRow from "./ui/TableRow";
import { useRowExpand } from "./hooks/useRowExpand";

export default function CardTable() {
  const { server } = useServer();
  const { theme } = useTheme();
  const today = Date.now();
  const { expandedRows, handleToggleExpand } = useRowExpand();
  const {
    // states
    isOpen,
    isLoading,
    isLoading2,
    cardId,
    showVirtualSingers,
    showLN,
    showMMJ,
    showVBS,
    showWxS,
    showN25,

    // set set st
    setIsLoading,
    setIsLoading2,
    setShowVirtualSingers,
    setShowLN,
    setShowMMJ,
    setShowVBS,
    setShowWxS,
    setShowN25,

    // data
    sortedData,

    // functionality
    handleCardClick,
    handleCloseModal,
    handleSort,
    getSortIndicator,
    getRarityBarColor,
    getMaxCountForCategory,
  } = useCardTable(server, today);

  return (
    <div
      className={`p-2 sm:p-4 transition-all duration-300 ease-in-out ${
        theme === "dark" ? "bg-[#101828]" : "bg-[#f9fafb]"
      }`}
    >
      {/* FILTERS */}
      <FilterControls
        showVirtualSingers={showVirtualSingers}
        setShowVirtualSingers={setShowVirtualSingers}
        showLN={showLN}
        setShowLN={setShowLN}
        showMMJ={showMMJ}
        setShowMMJ={setShowMMJ}
        showVBS={showVBS}
        setShowVBS={setShowVBS}
        showWxS={showWxS}
        setShowWxS={setShowWxS}
        showN25={showN25}
        setShowN25={setShowN25}
      />

      <div className="rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="max-h-[80vh] overflow-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full bg-white dark:bg-gray-800">
            {/* HEADER */}
            <TableHeader
              handleSort={handleSort}
              getSortIndicator={getSortIndicator}
            />
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* ROW */}
              {sortedData.map((character) => (
                <TableRow
                  key={character.id}
                  character={character}
                  getRarityBarColor={getRarityBarColor}
                  getMaxCountForCategory={getMaxCountForCategory}
                  handleCardClick={handleCardClick}
                  isExpanded={!!expandedRows[character.id]}
                  onToggleExpand={handleToggleExpand}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CardModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        cardId={cardId}
        isLoading={isLoading}
        isLoading2={isLoading2}
        setIsLoading={setIsLoading}
        setIsLoading2={setIsLoading2}
      />

      <WebsiteDisclaimer />
    </div>
  );
}
