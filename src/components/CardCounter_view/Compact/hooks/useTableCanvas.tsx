import { useRef } from "react";
import type { RefObject } from "react";
import type { IconData } from "../CanvasTableTypes";

interface UseTableCanvasReturn {
  canvasRef: RefObject<HTMLCanvasElement>;
  drawTableWithIcons: (
    iconPaths: string[],
    gridSize: [number, number],
    startAtRow2: boolean,
    dataPaths: IconData[],
    bgColor: string,
    displayWidth?: number,
    displayHeight?: number
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
    bgColor: string,
    displayWidth?: number,
    displayHeight?: number
  ): Promise<void> => {
    const canvas = canvasRef.current;

    if (!canvas) {
      console.warn("Canvas not available");
      return;
    }

    // Always set canvas drawing buffer to 700x700 
    canvas.width = 700;
    canvas.height = 700;

    // CSS size for responsive display
    if (displayWidth && displayHeight) {
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;
    } else {
      canvas.style.width = "700px";
      canvas.style.height = "700px";
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.warn("Could not get 2D context");
      return;
    }


    // Clear any previous transforms
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Fill 
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 700, 700);

    // Set dimensions - always use 700x700 c
    const [rows, cols] = gridSize;
    const padding = 10; 
    const availableWidth = 700 - padding * 2;
    const availableHeight = 700 - padding * 2;


    // Calculate cell size to fill available space while maintaining square cells
    const cellSize = Math.min(availableWidth / cols, availableHeight / rows);

    const tableWidth = cellSize * cols;
    const tableHeight = cellSize * rows;

    // Center the table 
    const offsetX = (700 - tableWidth) / 2;
    const offsetY = (700 - tableHeight) / 2;

    // Draw grid lines (inner lines only)
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 1;

    // Vertical lines (inner lines only)
    for (let i = 1; i < cols; i++) {
      const x = offsetX + i * cellSize;
      ctx.beginPath();
      ctx.moveTo(x, offsetY);
      ctx.lineTo(x, offsetY + tableHeight);
      ctx.stroke();
    }

    // Horizontal lines (inner lines only)
    for (let i = 1; i < rows; i++) {
      const y = offsetY + i * cellSize;
      ctx.beginPath();
      ctx.moveTo(offsetX, y);
      ctx.lineTo(offsetX + tableWidth, y);
      ctx.stroke();
    }

    // Load and draw unit icons in first column
    if (iconPaths && iconPaths.length > 0) {
      const iconPromises = iconPaths.map((path, index) => {
        const startIndex = startAtRow2 ? 1 : 0;
        const rowIndex = startIndex + index;

        if (rowIndex < rows && rowIndex >= 0) {
          return new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => {
              const iconSize = Math.min(cellSize * 0.8, 100); // Scale icon with cell size
              const iconPadding = (cellSize - iconSize) / 2;
              const x = offsetX + iconPadding;
              const y = offsetY + rowIndex * cellSize + iconPadding;
              ctx.drawImage(img, x, y, iconSize, iconSize);
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

    // Load and draw data icons
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
              const iconSize = Math.min(cellSize * 0.8, 100); // Scale icon 
              const iconPadding = (cellSize - iconSize) / 2;
              const x = offsetX + colIndex * cellSize + iconPadding;
              const y = offsetY + rowIndex * cellSize + iconPadding;
              ctx.drawImage(img, x, y, iconSize, iconSize);
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
