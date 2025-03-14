import "../../_styles/NavBar.css";
import { useNavigate } from "react-router-dom";
import instance from "../../_lib/axiosBase";
import { Friend, Person } from "../../_lib/responseTypes";
import { useState } from "react";
import { useAppDispatch } from "../../_lib/redux/hooks";
import { addFriend } from "../../_lib/redux/userSlice";

interface PeopleSubMenuProps {
    handleNewFriend: (id: string) => void
}

interface FriendSubMenuProps {
    friends: Friend[]
}

enum SubMenuOptions {
    People,
    Friends,
    None
}

const NavBar = () => {
    const dispatch = useAppDispatch();
    const [subMenu, setSubMenu] = useState<SubMenuOptions>(SubMenuOptions.None);

    const handleSubMenu = (option: SubMenuOptions) => {
        if (subMenu == option) {
            setSubMenu(SubMenuOptions.None);
        } else {
            setSubMenu(option);
        }
    }

    const handleNewFriend = async (id: string) => {
        try {
            const response = await instance.post<Friend>("/User/AddFriend", {id: id}, {withCredentials: true});
            console.log("New friend added :)", response.data);
            dispatch(addFriend(response.data));

        } catch (error) {
            console.error("Error adding new friend", error);
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
            <button id="friends-btn" onClick={() => handleSubMenu(SubMenuOptions.Friends)}>Friends</button>
            <button id="profile-btn" disabled>Profile</button>
            <button id="signout-btn" onClick={(e) => handleLogout(e)}>Sign Out</button>
        </div>
        {subMenu == SubMenuOptions.People ? 
            <PeopleSubMenu handleNewFriend={handleNewFriend} /> :
        subMenu == SubMenuOptions.Friends ?
            <FriendSubMenu friends={userInfo.friends} /> :
            <></>
        }
        </>
        
    )
}

const PeopleSubMenu = ({handleNewFriend}: PeopleSubMenuProps) => {
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
                            <div key={person.userId} className="person-result">
                                <p>{person.userName}</p>
                                <button onClick={() => handleNewFriend(person.userId)} disabled={person.isFriend}>Add</button>
                            </div>
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
                    <div className="friend-item">
                        <p>{friend.userName}</p>
                        <button>Invite</button>
                    </div>
                )
            })}
        </div>
    )
}

export default NavBar;