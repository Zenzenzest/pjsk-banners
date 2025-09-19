import { useRef } from "react";
import type { RefObject } from "react";
import type { IconData } from "./CanvasTableTypes";

interface UseTableCanvasReturn {
  canvasRef: RefObject<HTMLCanvasElement>;
  drawTableWithIcons: (
    iconPaths: string[],
    gridSize: [number, number],
    startAtRow2: boolean,
    dataPaths: IconData[],
    bgColor: string
  ) => Promise<void>;
  saveImage: (filename?: string) => void;
}

export const useTableCanvas = (): UseTableCanvasReturn => {
  const canvasRef = useRef<HTMLCanvasElement>(null!);

  const drawTableWithIcons = async (
    iconPaths: string[],
    gridSize: [number, number],
    startAtRow2: boolean,
    dataPaths: IconData[],
    bgColor: string
  ): Promise<void> => {
    const canvas = canvasRef.current;

    if (!canvas) {
      console.warn("Canvas not available");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.warn("Could not get 2D context");
      return;
    }
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set dimensions based on passed grid size
    const cellSize = 50;
    const [rows, cols] = gridSize;
    const tableWidth = cellSize * cols;
    const tableHeight = cellSize * rows;


    // Center the table on canvas with minimal padding
    const padding = 10;
    const offsetX = (canvas.width - tableWidth) / 2 + padding;
    const offsetY = (canvas.height - tableHeight) / 2 + padding;


    // Adjust for padding
    const adjustedOffsetX = offsetX - padding;
    const adjustedOffsetY = offsetY - padding;


    // Draw grid lines (inner lines only)
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 1;

    // Vertical lines (inner lines only)
    for (let i = 1; i < cols; i++) {
      const x = adjustedOffsetX + i * cellSize;
      ctx.beginPath();
      ctx.moveTo(x, adjustedOffsetY);
      ctx.lineTo(x, adjustedOffsetY + tableHeight);
      ctx.stroke();
    }
    // Horizontal lines (inner lines only)
    for (let i = 1; i < rows; i++) {
      const y = adjustedOffsetY + i * cellSize;
      ctx.beginPath();
      ctx.moveTo(adjustedOffsetX, y);
      ctx.lineTo(adjustedOffsetX + tableWidth, y);
      ctx.stroke();
    }



    // Load and draw unit icons in first column starting at [1,2]
    if (iconPaths && iconPaths.length > 0) {
      const iconPromises = iconPaths.map((path, index) => {
        const startIndex = startAtRow2 ? 1 : 0;
        const rowIndex = startIndex + index;

        if (rowIndex < rows && rowIndex >= 0) {
          return new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => {
              const x = adjustedOffsetX + 5;
              const y = adjustedOffsetY + rowIndex * cellSize + 5;
              ctx.drawImage(img, x, y, 40, 40);
              resolve();
            };
            img.onerror = () => resolve();
            img.src = path;
          });
        } else {
          return Promise.resolve();
        }
      });

      await Promise.all(iconPromises);
    }

// Load the rest of the icons (card icons)
    if (dataPaths && dataPaths.length > 0) {
      const dataPromises = dataPaths.map((data) => {
        // Convert 1-based coordinates to 0-based array indices
        const rowIndex = data.row !== undefined ? data.row - 1 : -1;
        const colIndex = data.col !== undefined ? data.col - 1 : -1;

        // Check bounds
        if (
          rowIndex >= 0 &&
          rowIndex < rows &&
          colIndex >= 0 &&
          colIndex < cols
        ) {
          return new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => {
              const x = adjustedOffsetX + colIndex * cellSize + 5;
              const y = adjustedOffsetY + rowIndex * cellSize + 5;
              ctx.drawImage(img, x, y, 40, 40);
              resolve();
            };
            img.onerror = () => resolve();
            img.src = data.iconPath;
          });
        } else {
          return Promise.resolve();
        }
      });

      await Promise.all(dataPromises);
    }
  };

  const saveImage = (filename = "table-with-icons.png"): void => {
    const canvas = canvasRef.current;

    if (!canvas) {
      console.warn("Canvas not available for saving");
      return;
    }

    const link = document.createElement("a");
    link.download = filename;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return { canvasRef, drawTableWithIcons, saveImage };
};
