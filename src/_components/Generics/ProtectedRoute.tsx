import { ComponentType, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import instance from "../../_lib/axiosBase";
import { useAppDispatch, useAppSelector } from "../../_lib/redux/hooks";
import { setUser } from "../../_lib/redux/userInfoSlice";

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

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await instance.get("/user/status", {withCredentials: true});
                dispatch(setUser(response.data));
                console.log(response.data)
                setAuthenticationState(AuthenticationStates.Authorized);
            } catch (error) {
                setAuthenticationState(AuthenticationStates.Unauthorized);
                console.error("Not authorized", error);
            }
        }

        checkAuthStatus();
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