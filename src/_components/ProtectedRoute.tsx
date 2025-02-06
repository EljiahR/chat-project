import axios from "axios";
import { ComponentType, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserInfo } from "../_lib/responseTypes";

interface Props {
    component: ComponentType<UserInfo>
}

enum AuthenticationStates {
    Loading,
    Authorized,
    Unauthorized
}

const ProtectedRoute = ({ component: Component }: Props) => {
    const [authenticationState, setAuthenticationState] = useState(AuthenticationStates.Loading);
    const [userInfo, setUserInfo] = useState<UserInfo>({
        userName: "",
        channelIds: []
    });

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await axios.get("https://localhost:7058/user/status", {withCredentials: true});
                console.log(response.data);
                setUserInfo(response.data);
                setAuthenticationState(AuthenticationStates.Authorized);
            } catch (error) {
                setAuthenticationState(AuthenticationStates.Unauthorized);
                console.error(error);
            }
        }

        checkAuthStatus();
        console.log(authenticationState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
        authenticationState == AuthenticationStates.Loading ? 
            <></> : 
            authenticationState == AuthenticationStates.Authorized ? 
                <Component {...userInfo} /> : 
                <Navigate to={"/signin"} />
    )
}

export default ProtectedRoute;