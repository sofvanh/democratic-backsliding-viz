export interface DataItem {
    id: string;
    label: string;
    color: string;
    data: DataPoint[];
}

export interface DataPoint {
    x: number;
    y: number;
}
