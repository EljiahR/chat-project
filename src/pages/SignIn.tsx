import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../_lib/axiosBase";
import { Button, Form, Stack } from "react-bootstrap";

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
        <Stack id="signin-page"className="max-h-100 py-2 d-flex justify-content-center align-items-center">
            <h3>Elijah's Chat Project</h3>
            <div className="w-100 max-w-md py-2 px-3 d-flex flex-column gap-3">
                <Form onSubmit={(e) => handleLoginSubmit(e)} id="signin-form">
                    <Stack gap={2} className="col-md-5 mx-auto">
                        <h4 className="align-self-center">Sign In</h4>
                        <Form.Group controlId="login-username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter your username..." onChange={(e) => handleLoginChange("userName", e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="login-password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={(e) => handleLoginChange("password", e.target.value)} />
                        </Form.Group>
                        <Button variant="primary" type="submit">Sign In</Button>
                    </Stack>
                </Form>
                
                
                <Form id="register-form" onSubmit={(e) => handleRegisterSubmit(e)}>
                    <Stack gap={2} className="col-md-5 mx-auto">
                        <h4 className="align-self-center">Register</h4>
                        <Form.Group controlId="register-username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter your username..." name="userName" value={registerCredentials["userName"]} onChange={(e) => handleRegisterChange("userName", e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="register-password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" name="password" value={registerCredentials["password"]} onChange={(e) => handleRegisterChange("password", e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="register-repeat-password">
                            <Form.Label>Repeat Password</Form.Label>
                            <Form.Control type="password" placeholder="Repeat password" name="repeat-password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
                        </Form.Group>
                        <Button variant="primary" type="submit">Register</Button>
                    </Stack>
                </Form>
                <div id="register-errors">
                    {!passwordsMatch ? 
                        <p>Passwords don't match</p> :
                        <></>
                    }
                </div>
            </div>
        </Stack>
        
    )
}

export default SignIn;