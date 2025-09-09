import { useState } from "react";
export const useRowExpand = () => {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const handleToggleExpand = (characterId: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [characterId]: !prev[characterId],
    }));
  };

  return { expandedRows, handleToggleExpand };
};
