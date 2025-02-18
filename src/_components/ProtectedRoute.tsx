import { ComponentType, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserInfo } from "../_lib/responseTypes";
import instance from "../_lib/axiosBase";

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: ComponentType<any>
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
        channels: [],
        friends: []
    });

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await instance.get("/user/status", {withCredentials: true});
                setUserInfo(response.data);
                setAuthenticationState(AuthenticationStates.Authorized);
            } catch (error) {
                setAuthenticationState(AuthenticationStates.Unauthorized);
                console.error(error);
            }
        }

        checkAuthStatus();
    }, []);
    
    return (
        authenticationState == AuthenticationStates.Loading ? 
            <></> : 
            authenticationState == AuthenticationStates.Authorized ? 
                <Component userInfoReceived={userInfo} /> : 
                <Navigate to={"/signin"} />
    )
}

export default ProtectedRoute;