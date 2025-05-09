import { ComponentType, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../_lib/redux/hooks";
import { setUser } from "../../_lib/redux/userInfoSlice";
import { useAuth } from "../AuthContext";

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
    const userInfo = useAppSelector((state) => state.userInfo);
    const dispatch = useAppDispatch();
    const [authenticationState, setAuthenticationState] = useState(AuthenticationStates.Loading);
    const { status, accessToken } = useAuth();

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const data = await status();
                dispatch(setUser(data));
                console.log(data)
                setAuthenticationState(AuthenticationStates.Authorized);
            } catch (error) {
                setAuthenticationState(AuthenticationStates.Unauthorized);
                console.error("Not authorized", error);
            }
        }
        if (!accessToken) {
            checkAuthStatus();
        } else {
            setAuthenticationState(AuthenticationStates.Authorized);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
        authenticationState == AuthenticationStates.Loading ? 
            <></> : 
            authenticationState == AuthenticationStates.Authorized ? 
                <Component userInfoReceived={userInfo} /> : 
                <Navigate to={"/"} />
    )
}

export default ProtectedRoute;