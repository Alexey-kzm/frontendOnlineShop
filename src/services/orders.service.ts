import {IGetOrder, IOrderForm, IOrderResponse} from "@/interfaces/order.interface";
import {axiosWithAuth} from "@/api/interceptors";

class OrdersService {
    async addOrder(order: IOrderForm) {
        const response = await axiosWithAuth.post<IOrderResponse>(`orders/create`, order);
        window.location.href = response.data.confirmationUrl;
        return response;
    }
    async getOrders(){
        const response = await axiosWithAuth.get<IGetOrder[]>(`orders`);
        return response.data;
    }
}
export const ordersService = new OrdersService();