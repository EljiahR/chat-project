import { useNavigate } from "react-router-dom";
import instance from "../../_lib/axiosBase";
import { Channel, Friend, Person } from "../../_lib/responseTypes";
import React, { SetStateAction, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../_lib/redux/hooks";
import { addFriend, addUserToChannel, selectAllFriends } from "../../_lib/redux/userSlice";
import { buttonStyleLight, buttonStyleLightDisabled, buttonStyleRed, mobileSubMenuStyle } from "../../_lib/tailwindShortcuts";
import { SubMenu } from "../../pages/ChatHome";
import PeopleSubMenu from "./UserControlsSubComponents/PeopleSubMenu";
import FriendSubMenu from "./UserControlsSubComponents/FriendSubMenu";


export enum SubMenuOptions {
    People,
    Friends,
    None
}

interface Props {
    selectedChannel: Channel | null;
    selectedSubMenu: SubMenu;
    setSelectedSubMenu: React.Dispatch<SetStateAction<SubMenu>>
}

const UserControls = ({selectedChannel, selectedSubMenu, setSelectedSubMenu}: Props) => {
    const friends = useAppSelector(selectAllFriends);
    const dispatch = useAppDispatch();
    const [subMenu, setSubMenu] = useState<SubMenuOptions>(SubMenuOptions.None);

    const handleSubMenu = (option: SubMenuOptions) => {
        if (subMenu == option) {
            setSubMenu(SubMenuOptions.None);
        } else {
            setSubMenu(option);
            setSelectedSubMenu(SubMenu.None)
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

export default UserControls;