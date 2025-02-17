import { useNavigate } from "react-router-dom";
import instance from "../../_lib/axiosBase";
import { Friend, UserInfo } from "../../_lib/responseTypes";
import { useState } from "react";

interface NavBarProps {
    userInfo: UserInfo
}

interface FriendsDisplayProps {
    friends: Friend[]
}

enum SubMenuOptions {
    People,
    Friends,
    None
}

const NavBar = ({userInfo}: NavBarProps) => {
    const [subMenu, setSubMenu] = useState<SubMenuOptions>(SubMenuOptions.None);
    const handleSubMenu = (option: SubMenuOptions) => {
        setSubMenu(option);
    }
    
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
        <>
        <div id="nav-bar">
            <button id="people-btn" onClick={() => handleSubMenu(SubMenuOptions.People)}>People</button>
            <button id="friends-btn" onClick={() => handleSubMenu(SubMenuOptions.Friends)} disabled>Friends</button>
            <button id="profile-btn" disabled>Profile</button>
            <button id="signout-btn" onClick={(e) => handleLogout(e)}>Sign Out</button>
        </div>
        {subMenu == SubMenuOptions.People ? 
            <></> :
        subMenu == SubMenuOptions.Friends ?
            <FriendsDisplay friends={userInfo.friends} /> :
            <></>
        }
        </>
        
    )
}

const FriendsDisplay = ({friends}: FriendsDisplayProps) => {
    
    
    return (
        <div id="friend-list">
            {friends.map(friend => {
                return (
                    <div>{friend.userName}</div>
                )
            })}
        </div>
    )
}

export default NavBar;