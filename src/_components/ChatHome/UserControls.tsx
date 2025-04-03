import { useNavigate } from "react-router-dom";
import instance from "../../_lib/axiosBase";
import { Channel, ChannelRole, FriendRequest, Person } from "../../_lib/responseTypes";
import React, { SetStateAction, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../_lib/redux/hooks";
import { acceptChannelInvite, acceptFriendRequest, selectAllChannelInvites, selectAllFriendRequests, selectAllFriends } from "../../_lib/redux/userSlice";
import { buttonStyleLight, buttonStyleLightDisabled, buttonStyleRed, mobileSubMenuStyle } from "../../_lib/tailwindShortcuts";
import PeopleSubMenu from "./UserControlsSubComponents/PeopleSubMenu";
import FriendSubMenu from "./UserControlsSubComponents/FriendSubMenu";
import { SubMenu, SubMenuOptions } from "../../_lib/pageTypes";
import ChannelInvitesSubMenu from "./UserControlsSubComponents/ChannelInvitesSubMenu";

interface Props {
    selectedChannel: Channel | null;
    selectedSubMenu: SubMenu;
    setSelectedSubMenu: React.Dispatch<SetStateAction<SubMenu>>
}

const UserControls = ({selectedChannel, selectedSubMenu, setSelectedSubMenu}: Props) => {
    const friends = useAppSelector(selectAllFriends);
    const friendRequests = useAppSelector(selectAllFriendRequests);
    const channelInvites = useAppSelector(selectAllChannelInvites);
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

    const handleNewFriendRequest = async (id: string) => {
        try {
            const response = await instance.post<Person>("/User/RequestFriend", {id: id}, {withCredentials: true});
            console.log(response.data);
        } catch (error) {
            console.error("Error sending request", error);
        }
    }

    const handleInviteToChannel = async (userId: string) => {
        if (!selectedChannel) return;
        try {
            const response = await instance.post<{message: string}>(`/Channel/InviteUserToChannel`, {userId, channelId: selectedChannel.id, role: ChannelRole.Member},{withCredentials: true}) ;
            if (response.status == 200) {
                console.log(response.data.message);
            }
        } catch (error) {
            console.error("Error adding user to channel", error);
        }
    };

    const handleAcceptFriendRequest = async (request: FriendRequest) => {
        try {
            const response = await instance.post("/User/ConfirmFriendRequest", {id: request.initiatorId}, {withCredentials: true});
            if (response.status == 200) {
                dispatch(acceptFriendRequest({requestId: request.id, newFriend: request.initiator}));

            }
        } catch (error) {
            console.error("Error accepting friend request", error);
        }
    }

    const handleAcceptChannelInvite = async (inviteId: string, channelId: string) => {
        try {
            const response = await instance.post<{message: string, channel: Channel}>("/Channel/ConfirmChannelInvite", {channelId}, {withCredentials: true});
            if (response.status == 200) {
                dispatch(acceptChannelInvite({inviteId, newChannel: response.data.channel}));
                console.log(response.data.message);
            }
        } catch (error) {
            console.error("Error accepting channel invite", error);
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
        <div className={(selectedSubMenu == SubMenu.UserInfo ? mobileSubMenuStyle + " " : "") + "flex flex-col gap-2"} id="nav-bar">
            <button className={buttonStyleLight} id="people-btn" onClick={() => handleSubMenu(SubMenuOptions.People)}>
                People
            </button>
            <button className={buttonStyleLight}  id="friends-btn" onClick={() => handleSubMenu(SubMenuOptions.Friends)}>
                Friends
            </button>
            <button className={buttonStyleLight}  id="invites-btn" onClick={() => handleSubMenu(SubMenuOptions.ChannelInites)}>
                Invites
            </button>
            <button className={buttonStyleLightDisabled}  id="profile-btn" disabled={true}>
                Profile
            </button>
            <button className={buttonStyleRed} id="signout-btn" onClick={(e) => handleLogout(e)}>
                Sign Out
            </button>
        </div>
        {subMenu == SubMenuOptions.People ? 
            <PeopleSubMenu handleNewFriendRequest={handleNewFriendRequest} handleSubMenu={handleSubMenu} /> 
        :
        subMenu == SubMenuOptions.Friends ?
            <FriendSubMenu friends={friends} friendRequests={friendRequests} handleAcceptFriendRequest={handleAcceptFriendRequest} handleInviteToChannel={handleInviteToChannel} handleSubMenu={handleSubMenu} /> 
        :
        subMenu == SubMenuOptions.ChannelInites ?    
            <ChannelInvitesSubMenu channelInvites={channelInvites} handleAcceptChannelInvite={handleAcceptChannelInvite} handleSubMenu={handleSubMenu} /> 
        :
            <></>
        }
        </>
        
    )
}

export default UserControls;