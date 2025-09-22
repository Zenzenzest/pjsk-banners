import { useEffect } from "react";
import { useTableCanvas } from "./hooks/useTableCanvas";
import type { CanvasTableProps } from "./CanvasTableTypes";
import { useTheme } from "../../../context/Theme_toggle";

const TableCanvas = ({
  gridSize,
  iconPaths,
  filename,
  startAtRow2,
  dataPaths,
  responsive = true,
  wide,
}: CanvasTableProps) => {
  const { canvasRef, drawTableWithIcons, saveImage } = useTableCanvas();
  const { theme } = useTheme();
  const bgColor = theme === "dark" ? "#1e2939" : "#f5f7f9";

  const getDisplaySize = () => {
    if (!responsive) return { width: 700, height: 700 };
    const maxWidth = Math.min(700, window.innerWidth * 0.9);
    return { width: maxWidth, height: maxWidth };
  };

  useEffect(() => {
    if (!gridSize) return;

    const handleResize = () => {
      const { width, height } = getDisplaySize();
      drawTableWithIcons(
        iconPaths,
        gridSize,
        startAtRow2,
        dataPaths,
        bgColor,
        responsive ? width : undefined,
        responsive ? height : undefined,
        wide
      );
    };

    // Call immediately to set initial size
    handleResize();

    if (responsive) {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [
    gridSize,
    iconPaths,
    startAtRow2,
    dataPaths,
    bgColor,
    responsive,
    drawTableWithIcons,
    wide,
  ]);

  if (!gridSize) {
    return <div>Please provide gridSize prop</div>;
  }

  return (
    <div className="p-5">
      <canvas
        ref={canvasRef}
        className="border-3 border-blue-500/20 block mx-auto bg-[#1e2939] rounded-xl"
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
