import {axiosClassic, axiosWithAuth} from "@/api/interceptors";
import {IUser} from "@/interfaces/auth.interface";
import {ICreateAdditionalServiceForm} from "@/interfaces/additional-services.interface";
import {DateTime} from "luxon";

class AdditionalServicesService {
    private URL = 'additional-services'

    async createNew(form: ICreateAdditionalServiceForm) {
        const {data}= await axiosWithAuth.post(this.URL + "/create", form);
        return data;
    }

    async getWithinDay(dateTime: string) {
        const response = await axiosClassic.post<Array<{time:string}>>(this.URL + "/within-day", {dateTime: dateTime});
        return response.data;
    }
}

export const additionalServicesService = new AdditionalServicesService();