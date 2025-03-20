import { useNavigate } from "react-router-dom";
import instance from "../../_lib/axiosBase";
import { Channel, Friend, Person } from "../../_lib/responseTypes";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../_lib/redux/hooks";
import { addFriend, addUserToChannel, selectAllFriends } from "../../_lib/redux/userSlice";
import { Button, Stack } from "react-bootstrap";

interface PeopleSubMenuProps {
    handleNewFriend: (id: string) => void
}

interface FriendSubMenuProps {
    friends: Friend[],
    handleAddToChannel: (userId: string) => void
}

enum SubMenuOptions {
    People,
    Friends,
    None
}

interface Props {
    selectedChannel: Channel | null
}

const NavBar = ({selectedChannel}: Props) => {
    const friends = useAppSelector(selectAllFriends);
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

    const handleAddToChannel = async (userId: string) => {
        if (!selectedChannel) return;
        try {
            const response = await instance.post<{message: string, user: Person}>(`/Channel/AddUserToChannel`, {userId, channelId: selectedChannel.id},{withCredentials: true}) ;
            if (response.status == 200) {
                dispatch(addUserToChannel({channelId: selectedChannel.id, user: response.data.user}));
                console.log(response.data.message);
            }
        } catch(error) {
            console.error("Error adding user to channel", error);
        }
    };
    
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
        <Stack gap={1} id="nav-bar">
            <Button id="people-btn" onClick={() => handleSubMenu(SubMenuOptions.People)}>
                People
            </Button>
            <Button id="friends-btn" onClick={() => handleSubMenu(SubMenuOptions.Friends)}>
                Friends
            </Button>
            <Button id="profile-btn" disabled>
                Profile
            </Button>
            <Button id="signout-btn" onClick={(e) => handleLogout(e)}>
                Sign Out
            </Button>
        </Stack>
        {subMenu == SubMenuOptions.People ? 
            <PeopleSubMenu handleNewFriend={handleNewFriend} /> :
        subMenu == SubMenuOptions.Friends ?
            <FriendSubMenu friends={friends} handleAddToChannel={handleAddToChannel} /> :
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
                            <div key={"people"+person.userId} className="person-result">
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

const FriendSubMenu = ({friends, handleAddToChannel}: FriendSubMenuProps) => {
    return (
        <div id="friend-list" className="submenu">
            {friends.map(friend => {
                return (
                    <div key={"friend"+friend.userId} className="friend-item">
                        <p>{friend.userName}</p>
                        <button onClick={() => handleAddToChannel(friend.userId)}>Invite</button>
                    </div>
                )
            })}
        </div>
    )
}

export default NavBar;