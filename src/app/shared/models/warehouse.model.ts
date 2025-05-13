import { WarehouseGroup } from "./warehouse-group.model";

export interface Warehouse {
    id: number | null;
    code: string;
    description: string;
    warehouseGroupId: number | null;
    warehouseGroup: WarehouseGroup | null;
    remarks: string;
}