import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../_lib/axiosBase";
import { buttonStyle, buttonStyleGreen, formStyle, inputLabelStyle, pageSignInStyle, textInputStyle } from "../_lib/tailwindShortcuts";

const SignIn: React.FC = () => {
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
            const response = await instance.post("/user/signin", loginCredentials, {withCredentials: true});
            console.log("Login successful. ", response.data);
            navigate("/");
        } catch (error) {
            console.error("Trouble attempting login. " + error);
        }
    };

    const handleRegisterSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!passwordsMatch) return;
        try {
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
        }
    };
    
    return (
        <div id="signin-page"className={pageSignInStyle}>
            <h2>Elijah's Chat Project</h2>
            <div className="flex flex-col gap-5">
                <form onSubmit={(e) => handleLoginSubmit(e)} id="signin-form" className={formStyle}>
                    <h3 className="align-self-center">Returning User</h3>
                    <div className={inputLabelStyle}>
                        <label htmlFor="signin-username">Username</label>
                        <input type="text" id="signin-username" className={textInputStyle} placeholder="Enter your username..." onChange={(e) => handleLoginChange("userName", e.target.value)} />
                    </div>
                    <div className={inputLabelStyle}>
                        <label htmlFor="signin-password">Password</label>
                        <input type="password" id="signin-password" className={textInputStyle} placeholder="Password" onChange={(e) => handleLoginChange("password", e.target.value)} />
                    </div>
                    
                    <button className={buttonStyle} type="submit">Sign In</button>
                </form>
                
                
                <form id="register-form" onSubmit={(e) => handleRegisterSubmit(e)} className={formStyle}>
                    <h3 className="align-self-center">New User</h3>
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
                    
                    <button type="submit" className={buttonStyleGreen}>Register</button>
                </form>
                <div id="register-errors">
                    {!passwordsMatch ? 
                        <p>Passwords don't match</p> :
                        <></>
                    }
                </div>
            </div>
        </div>
        
    )
}

export default SignIn;