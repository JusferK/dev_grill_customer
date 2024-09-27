import { IOrderRequest } from "./order-request.model";

export interface IUser {
    email: string;
    password: string;
    name: string;
    lastName: string;
    nit: number;
    signDate: Date;
    orderRequestList?: IOrderRequest[]
}