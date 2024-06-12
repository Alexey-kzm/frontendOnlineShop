export interface IRegisterForm {
    email: string;
    password: string;
    name:string;
    lastname:string;
}

export interface ILoginForm{
    email: string;
    password: string;
}

export interface IUser {
    id:number;
    email: string;
    password: string;
    name: string;
    lastname: string;
}

export interface IAuthResponse{
    accessToken: string;
    refreshToken: string;
    user:IUser;
}