import { useNavigate } from "react-router-dom";
import instance from "../../_lib/axiosBase";
import { Friend, UserInfo } from "../../_lib/responseTypes";

interface NavBarProps {
    userInfo: UserInfo
}

interface FriendsDisplayProps {
    friends: Friend[]
}

const NavBar = ({userInfo}: NavBarProps) => {
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
            <button id="people-btn">People</button>
            <button id="friends-btn" disabled>Friends</button>
            <button id="profile-btn" disabled>Profile</button>
            <button id="signout-btn" onClick={(e) => handleLogout(e)}>Sign Out</button>
        </div>
    )
}

const FriendsDisplay = ({friends}: FriendsDisplayProps) => {
    
    
    return <></>
}

export default NavBar;