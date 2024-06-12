import {IUser} from "@/interfaces/auth.interface";
import {axiosWithAuth} from "@/api/interceptors";
import axios from "axios";
import {getAccessToken} from "@/services/auth-token.service";

class UserService {
    private URL='/user/profile'

    async getProfile(){
        const response = await axiosWithAuth.get(this.URL);
        return response.data;
    }

    async update(data:IUser){
        const response=await axiosWithAuth.put(this.URL, data);
        return response.data;
    }
}

export const userService = new UserService();