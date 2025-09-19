export type IconData = {
  iconPath: string;
  row: number | undefined;
  col: number | undefined;
};

export type CanvasTableProps = {
  gridSize: [number, number];
  iconPaths: string[];
  filename: string;
  startAtRow2: boolean;
  dataPaths: IconData[];

};
