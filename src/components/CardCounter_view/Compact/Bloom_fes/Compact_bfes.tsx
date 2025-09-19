import { useProsekaData } from "../../../../context/Data";
import CanvasTable from "../CanvasTable_container";
import { grouped } from "../../../../constants/common";
export default function CompactBFes() {
  const { allCards } = useProsekaData();
  const bfesGrid: [number, number] = [6, 7];
  const icons = Array(6)
    .fill(null)
    .map((_, i) => {
      return `/images/unit_icons/${i + 1}.png`;
    });
  const bfesCards = allCards.filter((card) => card.card_type === "bloom_fes");

  const dataPaths = bfesCards.map((card) => {
    const iconPath = `/images/card_icons/${card.id}_t.webp`;
    let ro;
    let co;

    Object.keys(grouped).map((unit, i) => {
      if (card.unit === unit) {
        ro = i + 1;
        const charIndex = grouped[unit].indexOf(card.character);
        co = charIndex + 2;
      }
    });
    return { iconPath: iconPath, row: ro, col: co };
  });

  return (
    <div>
      <CanvasTable
        gridSize={bfesGrid}
        iconPaths={icons}
        filename={"bfes.png"}
        startAtRow2={false}
        dataPaths={dataPaths}

      />
    </div>
  );
}
