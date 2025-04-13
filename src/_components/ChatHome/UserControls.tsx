import { useNavigate } from "react-router-dom";
import instance from "../../_lib/axiosBase";
import { Friendship } from "../../_lib/responseTypes";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../_lib/redux/hooks";
import { clearUser } from "../../_lib/redux/userInfoSlice";
import { buttonStyleLight, buttonStyleLightDisabled, buttonStyleRed, mobileSubMenuStyle } from "../../_lib/tailwindShortcuts";
import PeopleSubMenu from "./UserControlsSubComponents/PeopleSubMenu";
import FriendSubMenu from "./UserControlsSubComponents/FriendSubMenu";
import { SubMenu, SubMenuOptions } from "../../_lib/pageTypes";
import ChannelInvitesSubMenu from "./UserControlsSubComponents/ChannelInvitesSubMenu";
import { clearChatHub, setSelectedSubMenuOption } from "../../_lib/redux/chatUiSlice";
import { acceptChannelInviteHub, acceptFriendRequestHub, sendChannelInviteHub, sendFriendRequestHub } from "../../_lib/signalr/signalRMiddleware";

const UserControls = () => {
    const dispatch = useAppDispatch();
    const selectedChannelId = useAppSelector((state) => state.chatUi.selectedChannelId);
    const subMenu = useAppSelector((state) => state.chatUi.selectedSubMenu);
    const subMenuOption = useAppSelector((state) => state.chatUi.selectedSubMenuOptions);

    const handleNewFriendRequest = async (id: string) => {
        try {
            dispatch(sendFriendRequestHub(id));
            console.log("Friend request sent!");
        } catch (error) {
            console.error("Error sending request", error);
        }
    }

    const handleInviteToChannel = async (userId: string) => {
        if (selectedChannelId == "") return;
        try {
            dispatch(sendChannelInviteHub({channelId: selectedChannelId, newUserId: userId}));
            console.log("Channel invite sent!");
        } catch (error) {
            console.error("Error adding user to channel", error);
        }
    };

    const handleAcceptFriendRequest = async (request: Friendship) => {
        try {
            dispatch(acceptFriendRequestHub(request));
            console.log("Friend request accepted!");
        } catch (error) {
            console.error("Error accepting friend request", error);
        }
    }

    const handleAcceptChannelInvite = async (inviteId: string, channelId: string) => {
        try {
            dispatch(acceptChannelInviteHub(channelId));
            console.log(`Channel invite ${inviteId} accepted!`);
        } catch (error) {
            console.error("Error accepting channel invite", error);
        }
    }
    
    const navigate = useNavigate();

    const handleLogout = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        try {
            await instance.post("/user/signout", {}, {withCredentials: true});
            dispatch(clearUser());
            dispatch(clearChatHub());
            console.log("Logged out successfully!");
        } catch (error) {
            console.error(error);
        } finally {
            navigate("/");
        }
    }
    
    return (
        <>
        <div className={(subMenu == SubMenu.UserInfo ? mobileSubMenuStyle + " " : "") + "flex flex-col gap-2"} id="nav-bar">
            <button className={buttonStyleLight} id="people-btn" onClick={() => dispatch(setSelectedSubMenuOption(SubMenuOptions.People))}>
                People
            </button>
            <button className={buttonStyleLight}  id="friends-btn" onClick={() => dispatch(setSelectedSubMenuOption(SubMenuOptions.Friends))}>
                Friends
            </button>
            <button className={buttonStyleLight}  id="invites-btn" onClick={() => dispatch(setSelectedSubMenuOption(SubMenuOptions.ChannelInvites))}>
                Invites
            </button>
            <button className={buttonStyleLightDisabled}  id="profile-btn" disabled={true}>
                Profile
            </button>
            <button className={buttonStyleRed} id="signout-btn" onClick={(e) => handleLogout(e)}>
                Sign Out
            </button>
        </div>
        {subMenuOption == SubMenuOptions.People ? 
            <PeopleSubMenu handleNewFriendRequest={handleNewFriendRequest} /> 
        :
        subMenuOption == SubMenuOptions.Friends ?
            <FriendSubMenu handleAcceptFriendRequest={handleAcceptFriendRequest} handleInviteToChannel={handleInviteToChannel} /> 
        :
        subMenuOption == SubMenuOptions.ChannelInvites ?    
            <ChannelInvitesSubMenu handleAcceptChannelInvite={handleAcceptChannelInvite} /> 
        :
            <></>
        }
        </>
        
    )
}

export default UserControls;