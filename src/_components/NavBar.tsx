import { useNavigate } from "react-router-dom";
import instance from "../_lib/axiosBase";

const NavBar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        try {
            await instance.post("/user/signout", {}, {withCredentials: true});
            console.log("Logged out successfully!");
        } catch (error) {
            console.error(error);
        } finally {
            navigate("/signin");
        }
    }
    
    return (
        <div id="nav-bar">
            <button id="signout-btn" onClick={(e) => handleLogout(e)}>Sign Out</button>
        </div>
    )
}

export default NavBar;