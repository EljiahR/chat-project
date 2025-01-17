import axios from "axios";
import { FC, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface Props {
    component: JSX.Element
}

enum AuthenticationStates {
    Loading,
    Authorized,
    Unauthorized
}

const ProtectedRoutes: FC<Props> = ({ component }) => {
    const [authenticationState, setAuthenticationState] = useState(AuthenticationStates.Loading);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await axios.get("https://localhost:7058/user/status", {withCredentials: true});
                console.log(response.data);
                setAuthenticationState(AuthenticationStates.Authorized);
            } catch (error) {
                setAuthenticationState(AuthenticationStates.Unauthorized);
                console.error(error);
            }
        }

        checkAuthStatus();
        console.log(authenticationState);
    }, []);
    
    return (
        authenticationState == AuthenticationStates.Loading ? 
            <></> : 
            authenticationState == AuthenticationStates.Authorized ? 
                component : 
                <Navigate to={"/login"} />
    )
}

export default ProtectedRoutes;