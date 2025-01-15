import axios from "axios";
import { FC, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface Props {
    component: JSX.Element
}

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await axios.get("https://localhost:7058/user/status", {withCredentials: true});
                console.log(response.data);
                setIsAuthenticated(true);
            } catch (error) {
                setIsAuthenticated(false);
                console.error(error);
            }
        }

        checkAuthStatus();
    }, []);

    return isAuthenticated;
}

const ProtectedRoutes: FC<Props> = ({ component }) => {
    const isAuthenticated = useAuth();
    
    return isAuthenticated ? component : <Navigate to={"/"} />
}

export default ProtectedRoutes;