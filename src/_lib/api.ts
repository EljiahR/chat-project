import axios from "axios";
import backendUrl from "./backendUrl";

export const api = axios.create({
    baseURL: backendUrl
})

export const login = async (username: string, password: string) => {
    const response = await api.post<{accessToken: string, refreshToken: string}>("/user/signin", { username, password });
    return response.data;
}

export const refreshToken = async (refreshToken: string) => {
    const response = await api.post<{accessToken: string, refreshToken: string}>("/user/refresh", { refreshToken });
    return response.data;
}

export const logout = async () => {
    await api.post("/user/signout");
}
