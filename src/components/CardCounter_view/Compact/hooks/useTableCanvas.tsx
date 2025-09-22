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
    displayHeight?: number,
    wide?: boolean
  ) => Promise<void>;
  saveImage: (filename?: string) => void;
}

export const useTableCanvas = (): UseTableCanvasReturn => {
  const canvasRef = useRef<HTMLCanvasElement>(null!);

  // Constants for different resolutions
  const DOWNLOAD_RESOLUTION = 700;
  const MAX_DISPLAY_SIZE = 700;

  const WIDE_ASPECT_RATIO = 2; // width:height ratio when wide=true

  const drawTableWithIcons = async (
    iconPaths: string[],
    gridSize: [number, number],
    startAtRow2: boolean,
    dataPaths: IconData[],
    bgColor: string,
    displayWidth?: number,
    displayHeight?: number,
    wide: boolean = false
  ): Promise<void> => {
    const canvas = canvasRef.current;

    if (!canvas) {
      console.warn("Canvas not available");
      return;
    }

    // Group data icons by cell position (row, col) to analyze before calculating canvas size
    const iconsByCell = new Map<string, IconData[]>();
    if (dataPaths && dataPaths.length > 0) {
      const [rows, cols] = gridSize;
      dataPaths.forEach((data) => {
        const rowIndex = data.row !== undefined ? data.row - 1 : -1;
        const colIndex = data.col !== undefined ? data.col - 1 : -1;

        // Check bounds
        if (
          rowIndex >= 0 &&
          rowIndex < rows &&
          colIndex >= 0 &&
          colIndex < cols
        ) {
          const cellKey = `${rowIndex}-${colIndex}`;
          if (!iconsByCell.has(cellKey)) {
            iconsByCell.set(cellKey, []);
          }
          iconsByCell.get(cellKey)!.push(data);
        }
      });
    }

    // Determine which columns need expansion and count them
    const columnsNeedingExpansion = new Set<number>();
    for (const [cellKey, cellIcons] of iconsByCell.entries()) {
      const [, colIndex] = cellKey.split("-").map(Number);
      if (cellIcons.length === 2) {
        columnsNeedingExpansion.add(colIndex);
      }
    }

    // Check if auto-expansion is necessary (at least 2 columns need expansion and not wide mode)
    const shouldAutoExpand = !wide && columnsNeedingExpansion.size >= 2;

    // Calculate canvas dimensions
    let canvasWidth: number;
    let canvasHeight: number;

    if (wide) {
      canvasWidth = DOWNLOAD_RESOLUTION * WIDE_ASPECT_RATIO;
      canvasHeight = DOWNLOAD_RESOLUTION;
    } else if (shouldAutoExpand) {
      // Auto-expansion: calculate required width based on column requirements
      const [rows, cols] = gridSize;
      const EXPANSION_FACTOR = 1.25;

      // Calculate base cell height from height constraint only (not width)
      const baseCellHeight = DOWNLOAD_RESOLUTION / rows;

      // Calculate required width for all columns
      let totalRequiredWidth = 0;
      for (let col = 0; col < cols; col++) {
        if (col === 0) {
          // First column always square
          totalRequiredWidth += baseCellHeight;
        } else {
          const baseWidth = baseCellHeight;
          if (columnsNeedingExpansion.has(col)) {
            totalRequiredWidth += baseWidth * EXPANSION_FACTOR;
          } else {
            totalRequiredWidth += baseWidth;
          }
        }
      }

      // Add padding
      const padding = 10; // 10px on each side
      canvasWidth = totalRequiredWidth + padding;
      canvasHeight = DOWNLOAD_RESOLUTION; 
    } else {
      // Normal mode (1:1 ratio)
      canvasWidth = DOWNLOAD_RESOLUTION;
      canvasHeight = DOWNLOAD_RESOLUTION;
    }

    // Set canvas drawing buffer dimensions
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;


    // Calculate display size with aspect ratio preservation
    let finalDisplayWidth: number;
    let finalDisplayHeight: number;

    if (wide) {
      finalDisplayWidth = MAX_DISPLAY_SIZE * WIDE_ASPECT_RATIO;
      finalDisplayHeight = MAX_DISPLAY_SIZE;

      // Use custom display dimensions if provided, but apply wide aspect ratio and cap at MAX_DISPLAY_SIZE
      if (displayWidth && displayHeight) {
        const baseAspectRatio = displayWidth / displayHeight;
        const adjustedAspectRatio = baseAspectRatio * WIDE_ASPECT_RATIO;

        if (adjustedAspectRatio > 1) {
          // Wider than tall
          finalDisplayWidth = Math.min(
            displayWidth * WIDE_ASPECT_RATIO,
            MAX_DISPLAY_SIZE * WIDE_ASPECT_RATIO
          );
          finalDisplayHeight = finalDisplayWidth / adjustedAspectRatio;
        } else {
          // Taller than wide or square
          finalDisplayHeight = Math.min(displayHeight, MAX_DISPLAY_SIZE);
          finalDisplayWidth = finalDisplayHeight * adjustedAspectRatio;
        }
      }
    } else if (shouldAutoExpand) {
      // Auto-expansion display: maintain canvas aspect ratio but cap at reasonable size
      const canvasAspectRatio = canvasWidth / canvasHeight;

      if (canvasAspectRatio > 1) {
        // Canvas is wider than tall
        finalDisplayWidth = Math.min(
          canvasWidth,
          MAX_DISPLAY_SIZE * canvasAspectRatio
        );
        finalDisplayHeight = finalDisplayWidth / canvasAspectRatio;
      } else {
        // Canvas is taller than wide or square
        finalDisplayHeight = Math.min(canvasHeight, MAX_DISPLAY_SIZE);
        finalDisplayWidth = finalDisplayHeight * canvasAspectRatio;
      }

      // Use custom display dimensions if provided
      if (displayWidth && displayHeight) {
        const requestedAspectRatio = displayWidth / displayHeight;

        if (requestedAspectRatio > canvasAspectRatio) {
          // Requested size is wider than canvas ratio
          finalDisplayHeight = Math.min(displayHeight, MAX_DISPLAY_SIZE);
          finalDisplayWidth = finalDisplayHeight * canvasAspectRatio;
        } else {
          // Requested size accommodates canvas ratio
          finalDisplayWidth = Math.min(
            displayWidth,
            MAX_DISPLAY_SIZE * canvasAspectRatio
          );
          finalDisplayHeight = finalDisplayWidth / canvasAspectRatio;
        }
      }
    } else {
      // Normal mode display 
      finalDisplayWidth = MAX_DISPLAY_SIZE;
      finalDisplayHeight = MAX_DISPLAY_SIZE;

      // Use custom display dimensions if provided
      if (displayWidth && displayHeight) {
        finalDisplayWidth = Math.min(displayWidth, MAX_DISPLAY_SIZE);
        finalDisplayHeight = Math.min(displayHeight, MAX_DISPLAY_SIZE);
      }
    }

    // Set CSS size for responsive display
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
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Set dimensions
    const [rows, cols] = gridSize;
    const padding = 10;
    const availableWidth = canvasWidth - padding * 2;
    const availableHeight = canvasHeight - padding * 2;

    // Calculate column widths based on icon counts and mode
    const columnWidths: number[] = [];
    const EXPANSION_FACTOR = 1.25; // 25% expansion for cells with multiple icons

    // Calculate base cell dimensions
    const baseCellHeight = Math.min(
      availableWidth / (cols * (wide ? WIDE_ASPECT_RATIO : 1)),
      availableHeight / rows
    );

    // Calculate total expanded width needed
    for (let col = 0; col < cols; col++) {
      if (col === 0) {
        // First column (unit icons) keep normal width even in wide mode
        columnWidths[col] = baseCellHeight; // Square cell for first column
      } else {
        // Other columns expand in wide mode
        const baseWidth = wide
          ? baseCellHeight * WIDE_ASPECT_RATIO
          : baseCellHeight;

        // Apply expansion if needed
        if (columnsNeedingExpansion.has(col)) {
          columnWidths[col] = baseWidth * EXPANSION_FACTOR;
        } else {
          columnWidths[col] = baseWidth;
        }
      }
    }

    const tableWidth = columnWidths.reduce((sum, width) => sum + width, 0);
    const rowHeight = baseCellHeight; // Keep rows uniform height

    // Center the table
    const offsetX = (canvasWidth - tableWidth) / 2;
    const offsetY = (canvasHeight - rowHeight * rows) / 2;

    // Calculate column start positions
    const columnStartX: number[] = [];
    let currentX = offsetX;
    for (let col = 0; col < cols; col++) {
      columnStartX[col] = currentX;
      currentX += columnWidths[col];
    }

    // Draw grid lines (inner lines only)
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 1;

    // Vertical lines (inner lines only)
    for (let i = 1; i < cols; i++) {
      const x = columnStartX[i];
      ctx.beginPath();
      ctx.moveTo(x, offsetY);
      ctx.lineTo(x, offsetY + rowHeight * rows);
      ctx.stroke();
    }

    // Horizontal lines (inner lines only)
    for (let i = 1; i < rows; i++) {
      const y = offsetY + i * rowHeight;
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
              const cellWidth = columnWidths[0];
              const iconSize = Math.min(cellWidth * 0.8, rowHeight * 0.8, 100);
              const iconPaddingX = (cellWidth - iconSize) / 2;
              const iconPaddingY = (rowHeight - iconSize) / 2;
              const x = columnStartX[0] + iconPaddingX;
              const y = offsetY + rowIndex * rowHeight + iconPaddingY;
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

    // Draw data icons for each cell
    if (iconsByCell.size > 0) {
      const cellPromises = Array.from(iconsByCell.entries()).map(
        ([cellKey, cellIcons]) => {
          const [rowIndex, colIndex] = cellKey.split("-").map(Number);

          return Promise.all(
            cellIcons.map((data, iconIndex) => {
              return new Promise<void>((resolve) => {
                const img = new Image();
                img.onload = () => {
                  try {
                    const iconsInCell = cellIcons.length;
                    const cellWidth = columnWidths[colIndex];
                    const cellHeight = rowHeight;

                    // Calculate icon size based on how many icons are in the cell
                    let iconSize: number;
                    let positions: { x: number; y: number }[] = [];

                    // Reduced padding for wide mode to utilize space better
                    const paddingFactor = wide ? 0.05 : 0.1; // 5% padding for wide, 10% for normal
                    const baseCellPadding =
                      Math.min(cellWidth, cellHeight) * paddingFactor;
                    const availableCellWidth = cellWidth - baseCellPadding * 2;
                    const availableCellHeight =
                      cellHeight - baseCellPadding * 2;

                    if (iconsInCell === 1) {
                      if (wide) {
                        iconSize = 250;
                        // Minimal padding for wide mode
                        const iconPaddingX = (cellWidth - iconSize) / 2;
                        const iconPaddingY = (cellHeight - iconSize) / 2;
                        positions = [
                          {
                            x: columnStartX[colIndex] + iconPaddingX,
                            y: offsetY + rowIndex * rowHeight + iconPaddingY,
                          },
                        ];
                      } else {
                        // Normal mode - keep original sizing
                        iconSize = Math.min(
                          cellWidth * 0.8,
                          cellHeight * 0.8,
                          100
                        );
                        const iconPaddingX = (cellWidth - iconSize) / 2;
                        const iconPaddingY = (cellHeight - iconSize) / 2;
                        positions = [
                          {
                            x: columnStartX[colIndex] + iconPaddingX,
                            y: offsetY + rowIndex * rowHeight + iconPaddingY,
                          },
                        ];
                      }
                    } else if (iconsInCell === 2) {
                      // Two icons - always side by side with balanced spacing
                      const maxSize = Math.min(
                        availableCellWidth * 0.48,
                        availableCellHeight * 0.95
                      );
                      iconSize = maxSize;

                      // Calculate equal spacing for two icons
                      const totalIconWidth = iconSize * 2;
                      const remainingSpace =
                        availableCellWidth - totalIconWidth;
                      const spacing = remainingSpace / 3; // Equal spacing: before, between, and after icons

                      const startY =
                        offsetY +
                        rowIndex * rowHeight +
                        (cellHeight - iconSize) / 2;

                      positions = [
                        {
                          x: columnStartX[colIndex] + baseCellPadding + spacing,
                          y: startY,
                        },
                        {
                          x:
                            columnStartX[colIndex] +
                            baseCellPadding +
                            spacing * 2 +
                            iconSize,
                          y: startY,
                        },
                      ];
                    } else {
                      // More than 4 icons - grid arrangement
                      const gridSize = Math.ceil(Math.sqrt(iconsInCell));

                      if (wide) {
                        // In wide mode, use larger icons
                        iconSize = Math.min(
                          (availableCellWidth / gridSize) * 0.9,
                          (availableCellHeight / gridSize) * 0.9,
                          45 // Larger max size for wide mode
                        );
                      } else {
                        // Normal mode
                        iconSize = Math.min(
                          (availableCellWidth / gridSize) * 0.8,
                          (availableCellHeight / gridSize) * 0.8,
                          30
                        );
                      }

                      // Calculate spacing
                      const spacingX =
                        (availableCellWidth - iconSize * gridSize) /
                        (gridSize + 1);
                      const spacingY =
                        (availableCellHeight - iconSize * gridSize) /
                        (gridSize + 1);

                      positions = [];
                      for (let i = 0; i < iconsInCell; i++) {
                        const gridRow = Math.floor(i / gridSize);
                        const gridCol = i % gridSize;
                        positions.push({
                          x:
                            columnStartX[colIndex] +
                            baseCellPadding +
                            spacingX +
                            gridCol * (iconSize + spacingX),
                          y:
                            offsetY +
                            rowIndex * rowHeight +
                            baseCellPadding +
                            spacingY +
                            gridRow * (iconSize + spacingY),
                        });
                      }
                    }

                    // Get position for this specific icon
                    const position = positions[iconIndex];
                    if (!position) {
                      resolve();
                      return;
                    }

                    ctx.save();

                    // Calculate final draw dimensions and position
                    let drawWidth = iconSize;
                    let drawHeight = iconSize;
                    const drawX = position.x;
                    let drawY = position.y;

                    // If wide=true, maintain original aspect ratio for data icons
                    if (wide && img.naturalWidth && img.naturalHeight) {
                      const imageAspectRatio =
                        img.naturalWidth / img.naturalHeight;

                      drawWidth = iconSize;
                      drawHeight = iconSize / imageAspectRatio;
                      drawY = position.y + (iconSize - drawHeight) / 2;
                    }

                    // Icon border radius based on the container size
                    const borderRadius = iconSize * 0.1;
                    if (ctx.roundRect) {
                      ctx.beginPath();
                      ctx.roundRect(
                        position.x,
                        position.y,
                        iconSize,
                        iconSize,
                        borderRadius
                      );
                      ctx.clip();
                    } else {
                      ctx.beginPath();
                      ctx.moveTo(position.x + borderRadius, position.y);
                      ctx.lineTo(
                        position.x + iconSize - borderRadius,
                        position.y
                      );
                      ctx.quadraticCurveTo(
                        position.x + iconSize,
                        position.y,
                        position.x + iconSize,
                        position.y + borderRadius
                      );
                      ctx.lineTo(
                        position.x + iconSize,
                        position.y + iconSize - borderRadius
                      );
                      ctx.quadraticCurveTo(
                        position.x + iconSize,
                        position.y + iconSize,
                        position.x + iconSize - borderRadius,
                        position.y + iconSize
                      );
                      ctx.lineTo(
                        position.x + borderRadius,
                        position.y + iconSize
                      );
                      ctx.quadraticCurveTo(
                        position.x,
                        position.y + iconSize,
                        position.x,
                        position.y + iconSize - borderRadius
                      );
                      ctx.lineTo(position.x, position.y + borderRadius);
                      ctx.quadraticCurveTo(
                        position.x,
                        position.y,
                        position.x + borderRadius,
                        position.y
                      );
                      ctx.closePath();
                      ctx.clip();
                    }

                    // Draw the image with calculated dimensions
                    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

                    // Restore the context state
                    ctx.restore();
                  } catch (drawError) {
                    console.warn(
                      "Failed to draw image:",
                      data.iconPath,
                      drawError
                    );
                  }
                  resolve();
                };

                img.onerror = (error) => {
                  console.warn("Failed to load image:", data.iconPath, error);
                  resolve();
                };

                img.crossOrigin = "Anonymous";
                img.src = data.iconPath;
              });
            })
          );
        }
      );

      await Promise.all(cellPromises);
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
