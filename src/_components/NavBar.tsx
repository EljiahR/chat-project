import axios from "axios";
import { useNavigate } from "react-router-dom";

const NavBar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        try {
            await axios.post("https://localhost:7058/user/logout", {}, {withCredentials: true});
            console.log("Logged out successfully!");
        } catch (error) {
            console.error(error);
        } finally {
            navigate("/login");
        }
    }
    
    return (
        <div id="nav-bar">
            <button id="logout-btn" onClick={(e) => handleLogout(e)}>Logout</button>
        </div>
    )
}

export default NavBar;