import {IAuthResponse, ILoginForm, IRegisterForm} from "@/interfaces/auth.interface";
import {axiosClassic} from "@/api/interceptors";
import {
    getRefreshToken,
    removeAccessFromStorage,
    saveTokenStorage
} from "@/services/auth-token.service";

export const authService = {
    async register(data: IRegisterForm) {
        const response = await axiosClassic.post<IAuthResponse>(`/auth/register`, data);

        if (response.data.accessToken && response.data.refreshToken) saveTokenStorage(response.data.accessToken, response.data.refreshToken);
        return response;
    },

    async login(data: ILoginForm) {
        const response = await axiosClassic.post<IAuthResponse>(`/auth/login`, data);

        if (response.data.accessToken && response.data.refreshToken) saveTokenStorage(response.data.accessToken, response.data.refreshToken);
        return response;
    },

    async getNewTokens() {
        const response = await axiosClassic.post<IAuthResponse>(`/auth/login/access-token`, {refreshToken: getRefreshToken()});

        if (response.data) {
            removeAccessFromStorage();
            saveTokenStorage(response.data.accessToken, response.data.refreshToken);
        }

        return response;
    }
}