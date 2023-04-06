export type CanvasChartProps = {
  chartData: any;
  chartOptions: any;
  bBettingPhase: boolean;
};

export type LinChartContextProps = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  unitsPerTickX: number;
  unitsPerTickY: number;
}