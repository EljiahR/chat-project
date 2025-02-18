import "../../_styles/NavBar.css";
import { useNavigate } from "react-router-dom";
import instance from "../../_lib/axiosBase";
import { Friend, Person, UserInfo } from "../../_lib/responseTypes";
import { useState } from "react";

interface NavBarProps {
    userInfo: UserInfo
}

interface FriendSubMenuProps {
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
        if (subMenu == option) {
            setSubMenu(SubMenuOptions.None);
        } else {
            setSubMenu(option);
        }
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
            <PeopleSubMenu /> :
        subMenu == SubMenuOptions.Friends ?
            <FriendSubMenu friends={userInfo.friends} /> :
            <></>
        }
        </>
        
    )
}

const PeopleSubMenu = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Person[]>([]);

    const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == "Enter") {
            try {
                const response = await instance.get(`/User/FindByName/${searchQuery}`, {withCredentials: true});
                console.log("Search results", response.data);
                setSearchResults(response.data);
            } catch (error) {
                console.error(error);
                setSearchResults([]);
            }
        }
    }
    
    return (
        <div id="people-search"className="submenu">
            <input type="text" id="people-search-bar" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => handleSearch(e)} placeholder="Search by name..." />
            <div id="search-results">
                {searchResults.length > 0 ?
                    searchResults.map(person => {
                        return (
                            <div key={person.userId} className="person-result">{person.userName}</div>
                        )
                    }) :
                    <div className="person-result">No users found</div>

                }
            </div>
        </div>
    )
}

const FriendSubMenu = ({friends}: FriendSubMenuProps) => {
    return (
        <div id="friend-list" className="submenu">
            {friends.map(friend => {
                return (
                    <div className="friend-item">{friend.userName}</div>
                )
            })}
        </div>
    )
}

export default NavBar;