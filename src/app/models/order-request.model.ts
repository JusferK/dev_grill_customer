import { IMenuOrder } from "./menu-order.model";

export interface IOrderRequest {
    idOrderRequest?: number;
    orderDateTime: Date;
    totalDue: number;
    status: string;
    lastStatusUpdate: Date;
    userEmail: string;
    menuOrderList: IMenuOrder[]
}