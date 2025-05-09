import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react";
import { apiFindByName, apiLogin, apiLogout, apiNewChannel, apiRefreshToken, apiRegister, apiStatus } from "../_lib/api";
import { Channel, Person, UserInfo } from "../_lib/responseTypes";
import { Navigate } from "react-router-dom";

type JwtPayload = {
    exp: number;
}

type AuthContextType = {
    accessToken: string | null;
    login: (username: string, password: string) => Promise<UserInfo>;
    logout: () => void;
    status: () => Promise<UserInfo>;
    register: (username: string, email: string, password: string) => Promise<UserInfo>;
    findByName: (searchQuery: string) => Promise<Person[]>;
    newChannel: (newChannelName: string) => Promise<Channel>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode}> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
            await logout();
            return;
        }
         
        try {
            const newTokens = await apiRefreshToken(refreshToken);
            setAccessToken(newTokens.accessToken);
            localStorage.setItem("refreshToken", newTokens.refreshToken);
        } catch (err) {
            await logout();
            return;
        }
    };

    useEffect(() => {
        if (!accessToken) return;
        
        let timeoutId: ReturnType<typeof setTimeout>;

        const checkAndRefreshToken = async () => {
            const { exp } = jwtDecode<JwtPayload>(accessToken);
            const now = Date.now();
            const expirationTime = exp * 1000 - now;
            const refreshBuffer = 60 * 1000;

            if (expirationTime < refreshBuffer) {
                await refreshToken();
            }

            const nextInterval = Math.max(10000, expirationTime - refreshBuffer);
            timeoutId = setTimeout(checkAndRefreshToken, nextInterval);
        };

        checkAndRefreshToken();

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                checkAndRefreshToken();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            clearTimeout(timeoutId);
        }
    }, []);

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
        Navigate({to: "/"});
    };

    const status = async () => {
        const data = await apiStatus(accessToken ?? "");
        return data.info;
    }

    const register = async (username: string, email: string, password: string) => {
        const data = await apiRegister(username, email, password);
        setAccessToken(data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        return data.info;
    }

    const findByName = async (searchQuery: string) => {
        return await apiFindByName(searchQuery, accessToken ?? "");
    }

    const newChannel = async (newChannelName: string) => {
        return await apiNewChannel(newChannelName, accessToken ?? "");  
    }

    return (
        <AuthContext.Provider value={{ accessToken, login, logout, status, register, findByName, newChannel }}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be within AuthProvider");
    return context;
}