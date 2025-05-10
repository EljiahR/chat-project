import { useEffect, useMemo, useState } from "react";
import UserControls from "../_components/ChatHome/UserControls";
import ChannelList from "../_components/ChatHome/ChannelList";
import Chat from "../_components/ChatHome/Chat";
import HomeChannel from "../_components/ChatHome/HomeChannel";
import ChannelMenu from "../_components/ChatHome/ChannelMenu";
import { buttonStyleLight, chatMessageContentStyle, chatMessageDateStyle, chatMessageStyle, chatMessageUserStyle, notificationBubble, pageChatHomeStyle } from "../_lib/tailwindShortcuts";
import { useAppDispatch, useAppSelector } from "../_lib/redux/hooks";
import { SubMenu } from "../_lib/pageTypes";
import { setSelectedSubMenu } from "../_lib/redux/chatUiSlice";
import { messageSortByDateReverse } from "../_lib/sortFunctions";
import { closeConnection, startConnection } from "../_lib/signalr/signalRMiddleware";
import { setUser } from "../_lib/redux/userInfoSlice";
import { Navigate } from "react-router-dom";
import LoadingScreen from "../_components/Generics/LoadingScreen";
import { useAuth } from "../_components/AuthContext";

enum AuthenticationStates {
    Loading,
    Authorized,
    Unauthorized
}

const ChatHomePage = () => {
    const dispatch = useAppDispatch();
    const [authenticationState, setAuthenticationState] = useState(AuthenticationStates.Loading);
    const { status } = useAuth();

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const data = await status();
                dispatch(setUser(data));
                setAuthenticationState(AuthenticationStates.Authorized);
            } catch (error) {
                setAuthenticationState(AuthenticationStates.Unauthorized);
                console.error("Not authorized", error);
            }
        }

        checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
        authenticationState == AuthenticationStates.Loading ? 
            <LoadingScreen /> : 
            authenticationState == AuthenticationStates.Authorized ? 
                <CoreComponent /> : 
                <Navigate to={"/"} />
    )
}

const CoreComponent = () => {
    const dispatch = useAppDispatch();
    const selectedChannelId = useAppSelector((state) => state.chatUi.selectedChannelId);
    const selectedChannel = useAppSelector((state) => state.userInfo.channels.entities[selectedChannelId]);
    const messages = useAppSelector((state) => state.chatUi.selectedChannelId != "" ? state.userInfo.channels.entities[selectedChannelId].channelMessages : []);
    const userName = useAppSelector((state) => state.userInfo.userName);
    const newFriendRequest = useAppSelector((state) => state.userInfo.newFriendRequest);
    const newChannelInvite = useAppSelector((state) => state.userInfo.newChannelInvite);

    // Attempt to connect to hub on mount
    useEffect(() => {
        const previousTitle = document.title;
        document.title = "Home";
        dispatch(startConnection());

        return (() => {
            document.title = previousTitle;
            dispatch(closeConnection());
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    const handleChannelMenuDisplay = (forceClose = false) => {
        const menu = document.querySelector("#channel-menu") as HTMLDivElement;
        if (menu == null) return;

        if (!menu.classList.contains("translate-x-full") || forceClose) {
            menu.classList.add("translate-x-full");
            menu.classList.remove("translate-x-0");
        } else {
            menu.classList.remove("translate-x-full");
            menu.classList.add("translate-x-0");
        }
    }

    const chatMessages = useMemo(() => {
        if (selectedChannelId == "") { 
            return [];
        }
        else {
            const channelMessages = messages ? messages.slice().sort(messageSortByDateReverse) : [];
            if (channelMessages) {
                let currentUserId = "";
                const condensedMessages = channelMessages.map((message, index, arr) => {
                    if (message.sentById == currentUserId) {
                        return null;
                    } else {
                        currentUserId = message.sentById;
                    }
                    const condensedMessage = {...message};
                    let i = 1;
                    let nextMessage = arr[index + i];
                    while (nextMessage && nextMessage.sentById == currentUserId) {
                        condensedMessage.content += "\n" + nextMessage.content;
                        i++;
                        nextMessage = arr[index + i];
                    }

                    return condensedMessage;
                });
                return condensedMessages.filter(m => m != null).map((channelMessage, index) => {
                    const newDate = new Date(channelMessage.sentAt);
                    return (
                        <div className={chatMessageStyle} key={index}>
                            <div className={chatMessageUserStyle}>{channelMessage.username}<div className={chatMessageDateStyle}>{newDate.toLocaleString()}</div></div>
                            <div className={chatMessageContentStyle}>{channelMessage.content}</div>
                        </div>)
                })
            }
        }
    }, [selectedChannelId, messages])

    useEffect(() => {
        if (selectedChannel != null) {
            const previousTitle = document.title;
            document.title = selectedChannel.name;

            return (() => {document.title = previousTitle;});
        }
        
    }, [selectedChannel])
    

    return (
        <div id="chat-main" className={pageChatHomeStyle}>
            <div id="navbar-controls" className="row-span-1 row-start-1 sm:row-auto col-start-1 sm:hidden flex justify-between">
                <button onClick={() => dispatch(setSelectedSubMenu(SubMenu.ChannelList))} className={buttonStyleLight}>Channels</button>
                <button onClick={() => dispatch(setSelectedSubMenu(SubMenu.UserInfo))} className={buttonStyleLight}>
                    {userName}
                    {newChannelInvite || newFriendRequest ? <div className={notificationBubble}></div> : null}
                </button>
            </div>
            <div id="navbar" className="invisible sm:visible row-start-1 sm:row-auto col-start-1 sm:col-span-1 sm:flex sm:flex-col justify-between">
                <ChannelList  />
                <UserControls />
            </div>
            <div id="chat-container" className="row-span-11 sm:row-span-1 sm:col-span-5 h-full">
                {selectedChannel == null ? 
                <HomeChannel /> 
                :
                <Chat 
                    chatMessages={chatMessages != null ? [...chatMessages!].reverse() : []} 
                    handleChannelMenuDisplay={handleChannelMenuDisplay}
                />
                }
            </div>
            {selectedChannel != null ? <ChannelMenu channel={selectedChannel} handleChannelMenuDisplay={handleChannelMenuDisplay} /> : null}
        </div>
        
    )
};

export default ChatHomePage