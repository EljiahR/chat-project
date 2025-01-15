import { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";

const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://localhost:7058/login");
            console.log("Login attempted. " + response.data);
        } catch (error) {
            console.error("Trouble attempting login. " + error);
        }
    }
    
    return (
        <>
            <div id="login-div">
                <form onSubmit={(e) => handleSubmit(e)}>
                    <label htmlFor="username">Username: </label>
                    <input type="text" id="username" name="username" value={formData["username"]} onChange={(e) => handleChange(e)} />
                    <label htmlFor="password">Password: </label>
                    <input type="password" id="password" name="password" />
                    <button type="submit">Login</button>
                </form>
            </div>
        </>
    )
}

export default Login;