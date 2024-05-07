export interface DataItem {
  id: string;
  ISO: string;
  label: string;
  color: string;
  data: DataPoint[];
}

export interface DataPoint {
  x: number;
  y: number;
}

export interface ChoroplethDataItem {
  id: string,
  value: number
}