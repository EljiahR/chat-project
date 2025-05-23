import { FormEvent, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import LoadingSpinner from "../_lib/svgs/LoadingSpinner.svg?react";
import { buttonStyleBlue, buttonStyleBlueDisabled, buttonStyleGreen, buttonStyleGreenDisabled, formStyle, inputLabelStyle, loadingSpinnerStyle, pageSignInStyle, signInErrorStyle, textInputErrorStyle, textInputStyle } from "../_lib/tailwindShortcuts";
import { useAppDispatch } from "../_lib/redux/hooks";
import { clearChatHub } from "../_lib/redux/chatUiSlice";
import { clearUser, setUser } from "../_lib/redux/userInfoSlice";
import { PasswordShort, PasswordsNotMatching, UsernameBlank } from "../_lib/signInPageErrors";
import { useAuth } from "../_components/AuthContext";
import LoadingScreen from "../_components/Generics/LoadingScreen";

enum AuthenticationStates {
    Loading,
    Authorized,
    Unauthorized
}

interface RegisterErrors {
    username: string[],
    password: string[],
    repeatPassword: string
}

const SignInPage = () => {
    const dispatch = useAppDispatch();
    const [authenticationState, setAuthenticationState] = useState(AuthenticationStates.Loading);
    const { status } = useAuth();

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const data = await status();
                dispatch(setUser(data));
                setAuthenticationState(AuthenticationStates.Authorized);
            } catch (error) {
                setAuthenticationState(AuthenticationStates.Unauthorized);
                console.error("Not authorized", error);
            }
        }
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
            checkAuthStatus();
        } else {
            setAuthenticationState(AuthenticationStates.Unauthorized);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
        authenticationState == AuthenticationStates.Loading ? 
            <LoadingScreen /> : 
            authenticationState == AuthenticationStates.Authorized ? 
                <Navigate to={"/chat"} /> : 
                <CoreComponent />
    )
}

const CoreComponent: React.FC = () => {
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [repeatPassword, setRepeatPassword] = useState("");
    const [registerErrors, setRegisterErrors] = useState<RegisterErrors>({username: [], password: [], repeatPassword: ""});
    const dispatch = useAppDispatch();
    const { login, register } = useAuth();
    
    const [loginCredentials, setLoginCredentials] = useState({
        userName: "",
        password: ""
    });

    const handleLoginChange = (name: string, value: string) => {
        setLoginCredentials({...loginCredentials, [name]: value});
    };

    const [registerCredentials, setRegisterCredentials] = useState({
        userName: "",
        email: "",
        password: ""
    });

    const handleRegisterChange = (name: string, value: string) => {
        setRegisterCredentials({...registerCredentials, [name]: value});
        clearError(name.toLowerCase());
    };

    const handleRepeatPasswordChange = (value: string) => {
        setRepeatPassword(value);
        clearError("repeatPassword");
    }

    const navigate = useNavigate();

    useEffect(() => {
        const previousTitle = document.title;
        document.title = "Chat - Login";

        return (() => {document.title = previousTitle;});
    }, []);

    const clearError = (field: string) => {
        switch(true) {
            case (field == "username" && registerErrors.username.length > 0): 
                setRegisterErrors(prevErrors => ({...prevErrors, username: []}));
                break;
            case (field == "password" && registerErrors.password.length > 0):
                setRegisterErrors(prevErrors => ({...prevErrors, password: []}));    
            break;
            case (field == "repeatPassword" && registerErrors.repeatPassword != ""):
                setRegisterErrors(prevErrors => ({...prevErrors, repeatPassword: ""}));    
            break;
            default:
                break;
        }
    }

    const handleLoginSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            setIsSigningIn(true);
            const data = await login(loginCredentials.userName, loginCredentials.password);
            
            dispatch(clearChatHub());
            
            dispatch(clearUser());
            dispatch(setUser(data));
            navigate("/chat");
        } catch (error) {
            console.error("Trouble attempting login. " + error);
        } finally {
            setIsSigningIn(false);
        }
    };

    const handleRegisterSubmit = async (e: FormEvent) => {
        e.preventDefault();
        let errorOccured = false;
        // Username blank
        if (registerCredentials.userName.trim() != "" && registerErrors.username.includes(UsernameBlank)) {
            setRegisterErrors(prevErrors => ({...prevErrors, username: [...prevErrors.username.filter(err => err != UsernameBlank)]}));
        } else if (registerCredentials.userName.trim() == "") {
            if (!registerErrors.username.includes(UsernameBlank)) {
                setRegisterErrors(prevErrors => ({...prevErrors, username: [...prevErrors.username, UsernameBlank]}));
            }
            errorOccured = true;
        }

        // Password too short
        if (registerCredentials.password.length >= 6 && registerErrors.password.includes(PasswordShort)) {
            setRegisterErrors(prevErrors => ({...prevErrors, password: [...prevErrors.password.filter(err => err != PasswordShort)]}));
        } else if (registerCredentials.password.length < 6) {
            if (!registerErrors.password.includes(PasswordShort)) {
            setRegisterErrors(prevErrors => ({...prevErrors, password: [...prevErrors.password, PasswordShort]})); 
            }
            errorOccured = true;
        }

        // Passwords dont match
        if (registerCredentials.password == repeatPassword && registerErrors.repeatPassword != "") {
            setRegisterErrors(prevErrors => ({...prevErrors, repeatPassword: ""}));
        } else if (registerCredentials.password != repeatPassword) {
            if (registerErrors.repeatPassword != PasswordsNotMatching) {
                setRegisterErrors(prevErrors => ({...prevErrors, repeatPassword: PasswordsNotMatching}));
            }
            errorOccured = true;
        }
        
        if (errorOccured) {
            
            return;
        }

        try {
            setIsRegistering(true);
            const data = await register(registerCredentials.userName, registerCredentials.email, registerCredentials.password);
            
            setRegisterCredentials({
                userName: "",
                email: "",
                password: ""
            });
            setRepeatPassword("");
            dispatch(clearChatHub());
            dispatch(clearUser());
            dispatch(setUser(data));
            navigate("/chat");
        } catch (error) {
            console.error("Trouble registering. " + error);
        } finally {
            setIsRegistering(false);
        }
    };
    
    return (
        <div id="signin-page"className={pageSignInStyle}>
            <h2 className="font-bold text-xl">Elijah's Chat Project</h2>
            <div className="flex flex-col gap-7">
                <form onSubmit={(e) => handleLoginSubmit(e)} id="signin-form" className={formStyle}>
                    <h3 className="self-center align-self-center font-bold">Returning User</h3>
                    <div className={inputLabelStyle}>
                        <label htmlFor="signin-username">Username</label>
                        <input type="text" id="signin-username" className={textInputStyle} placeholder="Enter your username..." onChange={(e) => handleLoginChange("userName", e.target.value)} />
                    </div>
                    <div className={inputLabelStyle}>
                        <label htmlFor="signin-password">Password</label>
                        <input type="password" id="signin-password" className={textInputStyle} placeholder="Password" onChange={(e) => handleLoginChange("password", e.target.value)} />
                    </div>
                    
                    <button className={isSigningIn ? buttonStyleBlueDisabled : buttonStyleBlue} type="submit" disabled={isSigningIn}>{isSigningIn ? <><LoadingSpinner className={loadingSpinnerStyle} /> Loading...</> : "Sign In"}</button>
                </form>
                
                
                <form id="register-form" onSubmit={(e) => handleRegisterSubmit(e)} className={formStyle}>
                    <h3 className="self-center align-self-center font-bold">New User</h3>
                    <div className={inputLabelStyle}>
                        <label htmlFor="register-username">Username</label>
                        <input id="register-username" className={registerErrors.username.length > 0 ? textInputErrorStyle : textInputStyle} type="text" placeholder="Enter your username..." name="userName" value={registerCredentials["userName"]} onChange={(e) => handleRegisterChange("userName", e.target.value)} />
                    </div>
                    {registerErrors.username.length > 0 ? 
                        <div className={signInErrorStyle}>
                            {registerErrors.username.join(" ")}
                        </div> :
                        null
                    }
                    <div className={inputLabelStyle}>
                        <label htmlFor="register-password">Password</label>
                        <input id="register-password" className={registerErrors.password.length > 0 ? textInputErrorStyle : textInputStyle} type="password" placeholder="Password" name="password" value={registerCredentials["password"]} onChange={(e) => handleRegisterChange("password", e.target.value)} />
                    </div>
                    {registerErrors.password.length > 0 ? 
                        <div className={signInErrorStyle}>
                            {registerErrors.password.join(" ")}
                        </div> :
                        null
                    }
                    <div className={inputLabelStyle}>
                        <label htmlFor="repeat-password">Repeat Password</label>
                        <input id="repeat-password" className={registerErrors.repeatPassword != "" ? textInputErrorStyle : textInputStyle} type="password" placeholder="Repeat password" name="repeat-password" value={repeatPassword} onChange={(e) => handleRepeatPasswordChange(e.target.value)} />
                    </div>
                    {registerErrors.repeatPassword != "" ? 
                        <div className={signInErrorStyle}>
                            {registerErrors.repeatPassword}
                        </div> :
                        null
                    }
                    <button type="submit" className={isRegistering ? buttonStyleGreenDisabled : buttonStyleGreen} disabled={isRegistering}>{isRegistering ? <><LoadingSpinner className={loadingSpinnerStyle} /> Loading...</> : "Register"}</button>
                </form>
            </div>
            <p id="blurb" className="text-gray-300 text-sm">
                Built by <a href="https://github.com/EljiahR" className="underline hover:text-white">Elijah Reck</a> • <a href="https://github.com/EljiahR/chat-project.git" className="underline hover:text-white">Frontend</a> • <a href="https://github.com/EljiahR/ChatProject.Reck.git" className="underline hover:text-white">Backend</a> 
            </p>
        </div>
        
    )
}

export default SignInPage;