import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";

type JwtPayload = {
    exp: number;
}

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        if (!accessToken) return;

        const { exp } = jwtDecode<JwtPayload>(accessToken);
        const expirationTime = exp * 1000 - Date.now();
        const buffertime = 60 * 1000;
    })
}