import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../_lib/axiosBase";
import LoadingSpinner from "../_lib/svgs/LoadingSpinner.svg?react";
import { buttonStyleBlue, buttonStyleBlueDisabled, buttonStyleGreen, buttonStyleGreenDisabled, formStyle, inputLabelStyle, loadingSpinnerStyle, pageSignInStyle, textInputStyle } from "../_lib/tailwindShortcuts";
import { useAppDispatch } from "../_lib/redux/hooks";
import { clearChatHub } from "../_lib/redux/chatUiSlice";
import { clearUser } from "../_lib/redux/userInfoSlice";

const SignInPage: React.FC = () => {
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const dispatch = useAppDispatch();
    
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
    };

    const [repeatPassword, setRepeatPassword] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    useEffect(() => {
        setPasswordsMatch(repeatPassword == registerCredentials["password"]);
    }, [repeatPassword, registerCredentials]);
    

    const navigate = useNavigate();

    useEffect(() => {
        const previousTitle = document.title;
        document.title = "Chat - Login";

        return (() => {document.title = previousTitle;});
    }, []);

    const handleLoginSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            setIsSigningIn(true);
            const response = await instance.post("/user/signin", loginCredentials, {withCredentials: true});
            dispatch(clearChatHub());
            dispatch(clearUser());
            console.log("Login successful. ", response.data);
            navigate("/chat");
        } catch (error) {
            console.error("Trouble attempting login. " + error);
        } finally {
            setIsSigningIn(false);
        }
    };

    const handleRegisterSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!passwordsMatch) return;
        try {
            setIsRegistering(true);
            const response = await instance.post("/user/register", registerCredentials, {withCredentials: true});
            console.log("Register successful ", response.data);
            setRegisterCredentials({
                userName: "",
                email: "",
                password: ""
            });
            setRepeatPassword("");
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
                        <input id="register-username" className={textInputStyle} type="text" placeholder="Enter your username..." name="userName" value={registerCredentials["userName"]} onChange={(e) => handleRegisterChange("userName", e.target.value)} />
                    </div>
                    <div className={inputLabelStyle}>
                        <label htmlFor="register-password">Password</label>
                        <input id="register-password" className={textInputStyle} type="password" placeholder="Password" name="password" value={registerCredentials["password"]} onChange={(e) => handleRegisterChange("password", e.target.value)} />
                    </div>
                    
                    <div className={inputLabelStyle}>
                        <label htmlFor="repeat-password">Repeat Password</label>
                        <input id="repeat-password" className={textInputStyle} type="password" placeholder="Repeat password" name="repeat-password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
                    </div>
                    
                    <button type="submit" className={isRegistering ? buttonStyleGreenDisabled : buttonStyleGreen} disabled={isRegistering}>{isRegistering ? <><LoadingSpinner className={loadingSpinnerStyle} /> Loading...</> : "Register"}</button>
                </form>
                <div id="register-errors">
                    {!passwordsMatch ? 
                        <p>Passwords don't match</p> :
                        <></>
                    }
                </div>
            </div>
            <p id="blurb" className="text-gray-300 text-sm">
                Built by <a href="https://github.com/EljiahR" className="underline hover:text-white">Elijah Reck</a> • <a href="https://github.com/EljiahR/chat-project.git" className="underline hover:text-white">Frontend</a> • <a href="https://github.com/EljiahR/ChatProject.Reck.git" className="underline hover:text-white">Backend</a> 
            </p>
        </div>
        
    )
}

export default SignInPage;