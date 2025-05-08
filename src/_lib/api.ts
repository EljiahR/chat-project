import axios from "axios";
import backendUrl from "./backendUrl";

export const api = axios.create({
    baseURL: backendUrl
})

export const login = async (username: string, password: string) => {
    const response = await api.post("/user/signin", { username, password });
    return response.data;
}

export const refreshToken = async (accessToken: string, refreshToken: string) => {
    const response = await api.post("/user/refresh", { accessToken, refreshToken });
    return response.data;
}
