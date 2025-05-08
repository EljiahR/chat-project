import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react";
import { api, login, logout } from "../_lib/api";

type JwtPayload = {
    exp: number;
}

type AuthContextType = {
    accessToken: string | null;
    handleLogin: (username: string, password: string) => Promise<void>;
    handleLogout: () => void;
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
                    .catch(() => logout());
            }
        }, expirationTime - refreshBuffer);

        return () => clearTimeout(timeout);
    }, [accessToken]);

    const handleLogin = async (username: string, password: string) => {
        const data = await login(username, password);
        setAccessToken(data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
    };

    const handleLogout = async () => {
        setAccessToken(null);
        localStorage.removeItem("refreshToken");
        await logout();
    };

    return (
        <AuthContext.Provider value={{ accessToken, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be within AuthProvider");
    return context;
}