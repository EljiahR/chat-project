import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react";
import { api, apiLogin, apiLogout, apiRegister, apiStatus } from "../_lib/api";
import { UserInfo } from "../_lib/responseTypes";

type JwtPayload = {
    exp: number;
}

type AuthContextType = {
    accessToken: string | null;
    login: (username: string, password: string) => Promise<UserInfo>;
    logout: () => void;
    status: () => Promise<UserInfo>;
    register: (username: string, email: string, password: string) => Promise<UserInfo>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode}> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        if (!accessToken) return;

        const { exp } = jwtDecode<JwtPayload>(accessToken);
        const expirationTime = exp * 1000 - Date.now();
        const refreshBuffer = 60 * 1000;

        const timeout = setTimeout(() => {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                api.post("/user/refresh", { refreshToken })
                    .then(res => setAccessToken(res.data.accessToken))
                    .catch(() => apiLogout());
            }
        }, expirationTime - refreshBuffer);

        return () => clearTimeout(timeout);
    }, [accessToken]);

    const login = async (username: string, password: string) => {
        const data = await apiLogin(username, password);
        setAccessToken(data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        return data.info;
    };

    const logout = async () => {
        setAccessToken(null);
        localStorage.removeItem("refreshToken");
        await apiLogout();
    };

    const status = async () => {
        const refreshToken = localStorage.getItem("refreshToken");
        const data = await apiStatus(refreshToken ?? "");
        return data.info;
    }

    const register = async (username: string, email: string, password: string) => {
        const data = await apiRegister(username, email, password);
        setAccessToken(data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        return data.info;
    }

    return (
        <AuthContext.Provider value={{ accessToken, login, logout, status, register }}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be within AuthProvider");
    return context;
}