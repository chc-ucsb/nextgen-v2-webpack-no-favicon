export interface ChartConfig {
  source: {
    url: string;
    type: string;
  };
  overlays: [
    {
      type: string;
      forLayerId: string;
      title: string;
      timeseriesSourceLayerIds: Array<string>;
    }
  ];
  boundaries: Array<string>;
  boundaryLabels: Array<string>;
  chartTypes: [
    {
      graphTypes: Array<string>;
      dataType: string;
      dataRoot: string;
      yAxisRange: string;
      customColors: object;
    }
  ];
}
