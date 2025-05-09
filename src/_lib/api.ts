import axios from "axios";
import backendUrl from "./backendUrl";
import { Channel, Person, SignIn } from "./responseTypes";

export const api = axios.create({
    baseURL: backendUrl
})

export const apiLogin = async (username: string, password: string) => {
    const response = await api.post<SignIn>("/user/signin", { username, password });
    return response.data;
}

export const apiRefreshToken = async (refreshToken: string) => {
    const response = await api.post<{accessToken: string, refreshToken: string}>("/user/refresh", { refreshToken });
    return response.data;
}

export const apiLogout = async () => {
    await api.post("/user/signout");
}

export const apiStatus = async (accessToken: string) => {
    const response = await api.get<SignIn>("/user/status", {headers: {Authorization: `Bearer ${accessToken}`}});
    return response.data;
}

export const apiRegister = async (username: string, email: string, password: string) => {
    const response = await api.post<SignIn>("/user/register", {username, email, password}, {withCredentials: true});
    return response.data;
}

export const apiFindByName = async (searchQuery: string, accessToken: string) => {
    const response = await api.get<Person[]>(`/User/FindByName/${searchQuery}`, {headers: {Authorization: `Bearer ${accessToken}`}});
    return response.data;
}

export const apiNewChannel = async (newChannelName: string, accessToken: string) => {
    const response = await api.post<Channel>("/channel/new", {name: newChannelName}, {headers: {Authorization: `Bearer ${accessToken}`}});
    return response.data;
}
