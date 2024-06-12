export interface IOrderForm {
    address: string;
    orderCost:number;
products:IOrderProduct[];
}

export interface IOrderResponse{
confirmationUrl:string;
}

export interface IOrderProduct{
    productId:number;
    count:number
}
export interface IGetOrder{
    address:string;
    paymentId:string;
    products:IOrderProduct[];
}