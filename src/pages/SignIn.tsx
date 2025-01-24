import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../_lib/axiosBase";

const SignIn: React.FC = () => {
    const [credentials, setCredentials] = useState({
        userName: "",
        password: ""
    });
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCredentials({...credentials, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await instance.post("/user/signin", credentials, {withCredentials: true});
            console.log("Login attempted. " + response.data);
            navigate("/");
        } catch (error) {
            console.error("Trouble attempting login. " + error);
        }
    }
    
    return (
        <div id="signin-page-div">
            <div id="signin-div">
                <form onSubmit={(e) => handleSubmit(e)}>
                    <label htmlFor="username">Username: </label>
                    <input type="text" id="username" name="userName" value={credentials["userName"]} onChange={(e) => handleChange(e)} />
                    <label htmlFor="password">Password: </label>
                    <input type="password" id="password" name="password" value={credentials["password"]} onChange={(e) => handleChange(e)} />
                    <button type="submit">Login</button>
                </form>
            </div>
            <div id="register-div">

            </div>
        </div>
    )
}

export default SignIn;