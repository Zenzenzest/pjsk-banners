import { useEffect } from "react";
import { useTableCanvas } from "./useTableCanvas";
import type { CanvasTableProps } from "./CanvasTableTypes";
import { useTheme } from "../../../context/Theme_toggle";
const TableCanvas = ({
  gridSize,
  iconPaths,
  filename,
  startAtRow2,
  dataPaths,
}: CanvasTableProps) => {
  const { canvasRef, drawTableWithIcons, saveImage } = useTableCanvas();
  const { theme } = useTheme();
  const bgColor = theme === "dark" ? "#1e2939" : "#f5f7f9";

  useEffect(() => {
    if (gridSize) {
      drawTableWithIcons(iconPaths, gridSize, startAtRow2, dataPaths, bgColor);
    }
  }, [drawTableWithIcons, iconPaths, gridSize]);

  if (!gridSize) {
    return <div>Please provide gridSize prop</div>;
  }

  const [rows, cols] = gridSize;
  const canvasSize = Math.max(rows, cols) * 50 + 50;

  return (
    <div className="p-5">
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        className="border-3 border-blue-500/20  block mx-auto bg-[#1e2939] rounded-xl"
      />
      <div className="flex justify-center gap-3 mt-5">
        <button
          onClick={() => saveImage(filename)}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 cursor-pointer"
        >
          Save as Image
        </button>
      </div>
    </div>
  );
};

export default TableCanvas;
