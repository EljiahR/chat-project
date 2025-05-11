import { useNavigate } from "react-router-dom";
import { Friendship } from "../../_lib/responseTypes";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../_lib/redux/hooks";
import { clearUser, setChannelNotificationToFalse, setFriendNotificationToFalse } from "../../_lib/redux/userInfoSlice";
import { buttonStyleLight, buttonStyleLightDisabled, buttonStyleRed, mobileSubMenuStyle, notificationBubble } from "../../_lib/tailwindShortcuts";
import PeopleSubMenu from "./UserControlsSubComponents/PeopleSubMenu";
import FriendSubMenu from "./UserControlsSubComponents/FriendSubMenu";
import { SubMenu, SubMenuOptions } from "../../_lib/pageTypes";
import ChannelInvitesSubMenu from "./UserControlsSubComponents/ChannelInvitesSubMenu";
import { clearChatHub, setSelectedSubMenu, setSelectedSubMenuOption } from "../../_lib/redux/chatUiSlice";
import { acceptChannelInviteHub, acceptFriendRequestHub, sendChannelInviteHub, sendFriendRequestHub } from "../../_lib/signalr/signalRMiddleware";
import { useAuth } from "../AuthContext";

const UserControls = () => {
    const dispatch = useAppDispatch();
    const selectedChannelId = useAppSelector((state) => state.chatUi.selectedChannelId);
    const subMenu = useAppSelector((state) => state.chatUi.selectedSubMenu);
    const subMenuOption = useAppSelector((state) => state.chatUi.selectedSubMenuOptions);
    const newFriendRequest = useAppSelector((state) => state.userInfo.newFriendRequest);
    const newChannelInvite = useAppSelector((state) => state.userInfo.newChannelInvite);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
    const { logout } = useAuth();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleNewFriendRequest = async (id: string) => {
        try {
            dispatch(sendFriendRequestHub(id));
            
        } catch (error) {
            console.error("Error sending request", error);
        }
    }

    const handleInviteToChannel = async (userId: string) => {
        if (selectedChannelId == "") return;
        try {
            dispatch(sendChannelInviteHub({channelId: selectedChannelId, newUserId: userId}));
            
        } catch (error) {
            console.error("Error adding user to channel", error);
        }
    };

    const handleAcceptFriendRequest = async (request: Friendship) => {
        try {
            dispatch(acceptFriendRequestHub(request));
            
        } catch (error) {
            console.error("Error accepting friend request", error);
        }
    }

    const handleAcceptChannelInvite = async (inviteId: string, channelId: string) => {
        try {
            dispatch(acceptChannelInviteHub(channelId));
            
        } catch (error) {
            console.error("Error accepting channel invite to: " + inviteId, error);
        }
    }
    
    const navigate = useNavigate();

    const handleLogout = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        try {
            await logout();
            dispatch(clearUser());
            dispatch(clearChatHub());
            
        } catch (error) {
            console.error(error);
        } finally {
            navigate("/");
        }
    }

    const handleSubMenuChange = (option: SubMenuOptions) => {
        dispatch(setSelectedSubMenuOption(option));
        if (option == SubMenuOptions.ChannelInvites && newChannelInvite) {
            dispatch(setChannelNotificationToFalse());
        } else if (option == SubMenuOptions.Friends && newFriendRequest) {
            dispatch(setFriendNotificationToFalse());
        }
    }
    
    return (
        <>
        <div className={(subMenu == SubMenu.UserInfo ? mobileSubMenuStyle + " " : "") + "flex flex-col gap-2"} id="nav-bar">
            <button className={buttonStyleLight} id="people-btn" onClick={() => handleSubMenuChange(SubMenuOptions.People)}>
                People
            </button>
            <button className={buttonStyleLight}  id="friends-btn" onClick={() => handleSubMenuChange(SubMenuOptions.Friends)}>
                Friends
                {newFriendRequest ? <div className={notificationBubble}></div> : null}
            </button>
            <button className={buttonStyleLight}  id="invites-btn" onClick={() => handleSubMenuChange(SubMenuOptions.ChannelInvites)}>
                Invites
                {newChannelInvite ? <div className={notificationBubble}></div> : null}
            </button>
            <button className={buttonStyleLightDisabled}  id="profile-btn" disabled={true}>
                Profile
            </button>
            <button className={buttonStyleRed} id="signout-btn" onClick={(e) => handleLogout(e)}>
                Sign Out
            </button>
        </div>
        {subMenuOption == SubMenuOptions.People ? 
            <PeopleSubMenu handleNewFriendRequest={handleNewFriendRequest} isMobile={isMobile} /> 
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