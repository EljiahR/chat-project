import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../_lib/axiosBase";

const SignIn: React.FC = () => {
    const [loginCredentials, setLoginCredentials] = useState({
        userName: "",
        password: ""
    });

    const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLoginCredentials({...loginCredentials, [e.target.name]: e.target.value});
    };

    const [registerCredentials, setRegisterCredentials] = useState({
        userName: "",
        email: "",
        password: ""
    });

    const handleRegisterChange = (e: ChangeEvent<HTMLInputElement>) => {
        setRegisterCredentials({...registerCredentials, [e.target.name]: e.target.value});
    };

    const [repeatPassword, setRepeatPassword] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    useEffect(() => {
        setPasswordsMatch(repeatPassword == registerCredentials["password"]);
    }, [repeatPassword, registerCredentials]);
    

    const navigate = useNavigate();

    

    const handleLoginSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await instance.post("/user/signin", loginCredentials, {withCredentials: true});
            console.log("Login successful. " + response.data);
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
            console.log("Register successful " + response.data);
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
        <div id="signin-page-div">
            <div id="signin-div">
                <form onSubmit={(e) => handleLoginSubmit(e)} id="signin-form">
                    <label htmlFor="login-username">Username: </label>
                    <input type="text" id="login-username" name="userName" value={loginCredentials["userName"]} onChange={(e) => handleLoginChange(e)} />
                    <label htmlFor="login-password">Password: </label>
                    <input type="password" id="login-password" name="password" value={loginCredentials["password"]} onChange={(e) => handleLoginChange(e)} />
                    <button type="submit">Login</button>
                </form>
            </div>
            <div id="register-div">
                <form id="register-form" onSubmit={(e) => handleRegisterSubmit(e)}>
                    <label htmlFor="register-username">Username: </label>
                    <input type="text" id="register-username" name="userName" value={registerCredentials["userName"]} onChange={(e) => handleRegisterChange(e)}  />
                    <label htmlFor="register-password">Password: </label>
                    <input type="password" id="register-password" name="password" value={registerCredentials["password"]} onChange={(e) => handleRegisterChange(e)}  />
                    <label htmlFor="register-repeat-password">Repeat Password: </label>
                    <input type="password" id="register-repeat-password" name="repeat-password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
                    <button type="submit">Register</button>
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