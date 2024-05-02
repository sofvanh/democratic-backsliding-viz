export interface DataItem {
    id: string;
    data: DataPoint[];
}

export interface DataPoint {
    x: number;
    y: number;
}
