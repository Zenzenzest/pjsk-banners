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

  // Constants for different resolutions
  const DOWNLOAD_RESOLUTION = 700;
  const MAX_DISPLAY_SIZE = 500;

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

    // Always set canvas drawing buffer to high resolution for download
    canvas.width = DOWNLOAD_RESOLUTION;
    canvas.height = DOWNLOAD_RESOLUTION;

    // Calculate display size with aspect ratio preservation
    let finalDisplayWidth = MAX_DISPLAY_SIZE;
    let finalDisplayHeight = MAX_DISPLAY_SIZE;

    // Use custom display dimensions if provided, but cap at MAX_DISPLAY_SIZE
    if (displayWidth && displayHeight) {
      const aspectRatio = displayWidth / displayHeight;
      if (aspectRatio > 1) {
        // Wider than tall
        finalDisplayWidth = Math.min(displayWidth, MAX_DISPLAY_SIZE);
        finalDisplayHeight = finalDisplayWidth / aspectRatio;
      } else {
        // Taller than wide or square
        finalDisplayHeight = Math.min(displayHeight, MAX_DISPLAY_SIZE);
        finalDisplayWidth = finalDisplayHeight * aspectRatio;
      }
    }

    // Set CSS size for responsive display (capped at 500px)
    canvas.style.width = `${finalDisplayWidth}px`;
    canvas.style.height = `${finalDisplayHeight}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.warn("Could not get 2D context");
      return;
    }

    // Clear any previous transforms
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, DOWNLOAD_RESOLUTION, DOWNLOAD_RESOLUTION);

    // Set dimensions
    const [rows, cols] = gridSize;
    const padding = 10;
    const availableWidth = DOWNLOAD_RESOLUTION - padding * 2;
    const availableHeight = DOWNLOAD_RESOLUTION - padding * 2;

    // Calculate cell size to fill available space while maintaining square cells
    const cellSize = Math.min(availableWidth / cols, availableHeight / rows);

    const tableWidth = cellSize * cols;
    const tableHeight = cellSize * rows;

    // Center the table
    const offsetX = (DOWNLOAD_RESOLUTION - tableWidth) / 2;
    const offsetY = (DOWNLOAD_RESOLUTION - tableHeight) / 2;

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
              const iconSize = Math.min(cellSize * 0.8, 100);
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
              try {
                const iconSize = Math.min(cellSize * 0.8, 100);
                const iconPadding = (cellSize - iconSize) / 2;
                const x = offsetX + colIndex * cellSize + iconPadding;
                const y = offsetY + rowIndex * cellSize + iconPadding;

                ctx.save();

                // Icon border radius
                const borderRadius = iconSize * 0.1;
                if (ctx.roundRect) {
                  // Modern browsers
                  ctx.beginPath();
                  ctx.roundRect(x, y, iconSize, iconSize, borderRadius);
                  ctx.clip();
                } else {
                  // Fallback for older browsers
                  ctx.beginPath();
                  ctx.moveTo(x + borderRadius, y);
                  ctx.lineTo(x + iconSize - borderRadius, y);
                  ctx.quadraticCurveTo(
                    x + iconSize,
                    y,
                    x + iconSize,
                    y + borderRadius
                  );
                  ctx.lineTo(x + iconSize, y + iconSize - borderRadius);
                  ctx.quadraticCurveTo(
                    x + iconSize,
                    y + iconSize,
                    x + iconSize - borderRadius,
                    y + iconSize
                  );
                  ctx.lineTo(x + borderRadius, y + iconSize);
                  ctx.quadraticCurveTo(
                    x,
                    y + iconSize,
                    x,
                    y + iconSize - borderRadius
                  );
                  ctx.lineTo(x, y + borderRadius);
                  ctx.quadraticCurveTo(x, y, x + borderRadius, y);
                  ctx.closePath();
                  ctx.clip();
                }

                // Draw the image
                ctx.drawImage(img, x, y, iconSize, iconSize);

                // Restore the context state
                ctx.restore();
              } catch (drawError) {
                console.warn("Failed to draw image:", data.iconPath, drawError);
              }
              resolve();
            };

            img.onerror = (error) => {
              console.warn("Failed to load image:", data.iconPath, error);
              resolve();
            };

            // CORS handlging after switching from local icons to external host
            img.crossOrigin = "Anonymous";
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
