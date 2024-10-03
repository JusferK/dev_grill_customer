import { IMenuOrder } from "./menu-order.model";

export enum Status {
    Pending = 'pending',
    Progress = 'in progress',
    Completed = 'completed',
    Cancelled = 'cancelled'
}

export interface IOrderRequest {
    idOrderRequest?: number;
    orderDateTime: Date;
    totalDue: number;
    status: Status;
    lastStatusUpdate: Date;
    userEmail: string;
    menuOrderList: IMenuOrder[]
}