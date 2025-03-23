import { useNavigate } from "react-router-dom";
import instance from "../../_lib/axiosBase";
import { Channel, Friend, Person } from "../../_lib/responseTypes";
import React, { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../_lib/redux/hooks";
import { addFriend, addUserToChannel, selectAllFriends } from "../../_lib/redux/userSlice";
import Draggable from "react-draggable";
import { buttonStyleBlueSmall, buttonStyleGreenSmall, buttonStyleLight, buttonStyleLightDisabled, buttonStyleRed, buttonStyleRedSmall, draggableSubMenuStyle, mobileSubMenuStyle } from "../../_lib/tailwindShortcuts";
import { SubMenu } from "../../pages/ChatHome";

interface PeopleSubMenuProps {
    handleNewFriend: (id: string) => void,
    handleSubMenu: (option: SubMenuOptions) => void
}

interface FriendSubMenuProps {
    friends: Friend[],
    handleAddToChannel: (userId: string) => void,
    handleSubMenu: (option: SubMenuOptions) => void
}

enum SubMenuOptions {
    People,
    Friends,
    None
}

interface Props {
    selectedChannel: Channel | null;
    selectedSubMenu: SubMenu;
}

const UserControls = ({selectedChannel, selectedSubMenu}: Props) => {
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
        <div className={(selectedSubMenu == SubMenu.UserInfo ? mobileSubMenuStyle + " " : "") + "flex flex-col gap-2"} id="nav-bar">
            <button className={buttonStyleLight} id="people-btn" onClick={() => handleSubMenu(SubMenuOptions.People)}>
                People
            </button>
            <button className={buttonStyleLight}  id="friends-btn" onClick={() => handleSubMenu(SubMenuOptions.Friends)}>
                Friends
            </button>
            <button className={buttonStyleLightDisabled}  id="profile-btn" disabled={true}>
                Profile
            </button>
            <button className={buttonStyleRed} id="signout-btn" onClick={(e) => handleLogout(e)}>
                Sign Out
            </button>
        </div>
        {subMenu == SubMenuOptions.People ? 
            <PeopleSubMenu handleNewFriend={handleNewFriend} handleSubMenu={handleSubMenu} /> :
        subMenu == SubMenuOptions.Friends ?
            <FriendSubMenu friends={friends} handleAddToChannel={handleAddToChannel} handleSubMenu={handleSubMenu} /> :
            <></>
        }
        </>
        
    )
}

const PeopleSubMenu = ({handleNewFriend, handleSubMenu}: PeopleSubMenuProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Person[]>([]);
    const nodeRef = useRef(null);

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
        <Draggable nodeRef={nodeRef} bounds="#chat-main">
            <div id="people-search" className={draggableSubMenuStyle} ref={nodeRef}>
                <div className="flex justify-between gap-2">
                    <input type="text" id="people-search-bar" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => handleSearch(e)} placeholder="Search by name..." />
                    <button className={buttonStyleRedSmall} onClick={() => handleSubMenu(SubMenuOptions.None)}>X</button>
                </div>
                <div id="search-results" className="flex flex-col gap-2 mt-auto">
                    {searchResults.length > 0 ?
                        searchResults.map(person => {
                            return (
                                <div key={"people"+person.userId} className="flex justify-between">
                                    <p>{person.userName}</p>
                                    <button className={buttonStyleGreenSmall} onClick={() => handleNewFriend(person.userId)} disabled={person.isFriend}>Add</button>
                                </div>
                            )
                        }) :
                        <div className="person-result">No users found</div>

                    }
                </div>
            </div>
        </Draggable>
    )
}

const FriendSubMenu = ({friends, handleAddToChannel, handleSubMenu}: FriendSubMenuProps) => {
    const nodeRef = useRef(null);
    return (
        <Draggable nodeRef={nodeRef} bounds="#chat-main">
            <div id="friend-list" className={draggableSubMenuStyle}>
                <div className="flex justify-between">
                    <h3>Friends</h3>
                    <button className={buttonStyleRedSmall} onClick={() => handleSubMenu(SubMenuOptions.None)}>X</button>
                </div>
                <div id="friends"  ref={nodeRef}>
                    {friends.length > 0 ?
                        friends.map(friend => {
                            return (
                                <div key={"friend"+friend.userId} className="flex justify-between">
                                    <p>{friend.userName}</p>
                                    <button className={buttonStyleBlueSmall} onClick={() => handleAddToChannel(friend.userId)}>Invite</button>
                                </div>
                            )
                        })
                        :
                        <div>No friends :(</div>
                    }
                </div>
            </div> 
        </Draggable>
    )
}

export default UserControls;