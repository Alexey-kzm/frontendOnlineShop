import Cookies from "js-cookie";

export const getAccessToken = () => {
    const accessToken = Cookies.get("accessToken");

    return accessToken || null;
}

export const getRefreshToken = () => {
    const accessToken = Cookies.get("refreshToken");

    return accessToken || null;
}

export const saveTokenStorage=(accessToken:string,refreshToken:string) => {
    Cookies.set("accessToken", accessToken,{
        domain:"frontendonlineshop.onrender.com",
        sameSite:"strict",
        expires:1
    });
    Cookies.set("refreshToken", refreshToken,{
        domain:"frontendonlineshop.onrender.com",
        sameSite:"strict",
        expires:30
    });
}

export const removeAccessFromStorage=()=>{
    Cookies.remove("accessToken");
}

export const logOut=()=>{
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
}
