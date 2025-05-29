import { useEffect, useMemo, useRef, useState } from "react";
import UserControls from "../_components/ChatHome/UserControls";
import ChannelList from "../_components/ChatHome/ChannelList";
import Chat from "../_components/ChatHome/Chat";
import HomeChannel from "../_components/ChatHome/HomeChannel";
import ChannelMenu from "../_components/ChatHome/ChannelMenu";
import { buttonStyleLight, chatMessageContentStyle, chatMessageDateStyle, chatMessageStyle, chatMessageUserStyle, messageActionStyle, notificationBubble, pageChatHomeStyle } from "../_lib/tailwindShortcuts";
import { useAppDispatch, useAppSelector } from "../_lib/redux/hooks";
import { SubMenu } from "../_lib/pageTypes";
import { setSelectedChannel, setSelectedSubMenu } from "../_lib/redux/chatUiSlice";
import { messageSortByDateReverse } from "../_lib/sortFunctions";
import { closeConnection, deleteMessageToConnection, startConnection, tryReconnect } from "../_lib/signalr/signalRMiddleware";
import { selectAllChannels, setUser } from "../_lib/redux/userInfoSlice";
import { Navigate } from "react-router-dom";
import LoadingScreen from "../_components/Generics/LoadingScreen";
import { useAuth } from "../_components/AuthContext";
import { getHoursDifference } from "../_lib/timeFunctions";
import { CondensedMessage } from "../_lib/responseTypes";
import { ContextMenu } from "primereact/contextmenu";
import { MenuItem } from "primereact/menuitem";
import { LeadingActions, SwipeableList, SwipeableListItem, SwipeAction, Type } from "react-swipeable-list";
import { BrowserView, MobileView } from "react-device-detect";
import 'react-swipeable-list/dist/styles.css';

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
    const channels = useAppSelector(selectAllChannels);
    const selectedChannel = channels.find(c => c.id == selectedChannelId);
    const messages = selectedChannel != null ? selectedChannel.channelMessages : [];
    const userName = useAppSelector((state) => state.userInfo.userName);
    const userId = useAppSelector((state) => state.userInfo.id);
    const newFriendRequest = useAppSelector((state) => state.userInfo.newFriendRequest);
    const newChannelInvite = useAppSelector((state) => state.userInfo.newChannelInvite);
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
    const cm = useRef<ContextMenu>(null);
    const { status } = useAuth();

    const leadingActions = (messageId: string) => (
        <LeadingActions >
            <SwipeAction onClick={() => handleDeleteMessage(selectedChannelId, messageId)}>
                <div className="bg-red-700 flex items-center text-nowrap">Delete</div>
            </SwipeAction>
        </LeadingActions>
    );

    const MessageContextMenuItems: MenuItem[] = [{
        id: "MessageContext",
        label: "Delete",
        command: () => {
            handleDeleteMessage(selectedChannelId, selectedMessageId);
        },
        className: "max-w-sm mx-auto p-2 rounded-lg border border bg-gray-50 text-sm flex items-center justify-center select-none text-gray-600"

    }]
    // Attempt to connect to hub on mount
    useEffect(() => {
        const previousTitle = document.title;
        document.title = "Home";
        dispatch(startConnection());
        const previousChannelId = localStorage.getItem("selectedChannel");
        if (previousChannelId) {
            const previousChannel = channels.find(c => c.id === previousChannelId);
            if (previousChannel) {
                dispatch(setSelectedChannel(previousChannel));
            }
        }

        const onVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                window.location.reload();
            }
        }
        document.addEventListener("visibilitychange", onVisibilityChange);

        return (() => {
            document.title = previousTitle;
            document.removeEventListener("visibilitychange", onVisibilityChange);
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

    const onRightClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, messageId: string, messageUserId: string, canDelete: boolean) => {
        if (canDelete && cm.current && messageUserId == userId) {
            setSelectedMessageId(messageId);
            cm.current.show(e);
        } else {
            e.preventDefault();
        }
    }

    const handleDeleteMessage = (channelId: string, messageId: string | null) => {
        if (!messageId) return;
        dispatch(deleteMessageToConnection({channelId, messageId}));
    };

    const chatMessages = useMemo(() => {
        if (selectedChannelId == "" || !selectedChannel) { 
            return [];
        } else {
            const channelMessages = messages ? messages.slice().sort(messageSortByDateReverse) : [];
            if (channelMessages) {
                let lastUserId: string | null = null;
                let lastSentTime: Date | null = null;
                let currentCondensedMessage: CondensedMessage | null = null;
                const condensedMessages: CondensedMessage[] = [];
                for (let i = 0; i < channelMessages.length; i++) {
                    const currentMessage = channelMessages[i];
                    if (!lastUserId || currentMessage.sentById != lastUserId || !lastSentTime || getHoursDifference(lastSentTime, new Date(currentMessage.sentAt)) > 0.5) {
                        lastUserId = currentMessage.sentById;
                        lastSentTime = new Date(currentMessage.sentAt);
                        currentCondensedMessage = {
                            username: currentMessage.username,
                            messages: [currentMessage],
                            earliestSentAt: currentMessage.sentAt,
                            channelId: currentMessage.channelId,
                            sentById: currentMessage.sentById
                        };
                        condensedMessages.push(currentCondensedMessage);
                    } else if(currentCondensedMessage) {
                        currentCondensedMessage.messages = [...currentCondensedMessage.messages, currentMessage];
                        lastSentTime = new Date(currentMessage.sentAt);
                    }
                }

                return condensedMessages.filter(m => m != null).map((condensedMessage, index) => {
                    const newDate = new Date(condensedMessage.earliestSentAt);
                    return (
                        <div className={chatMessageStyle} key={index + condensedMessage.messages[0].id}>
                            <div className={chatMessageUserStyle}>{condensedMessage.username}<div className={chatMessageDateStyle}>{newDate.toLocaleString()}</div></div>
                                {condensedMessage.messages.map((message) => {
                                    return (
                                        <>
                                            <MobileView>
                                                <SwipeableList className={chatMessageContentStyle + (message.modifiers.includes("Action") ? " " + messageActionStyle : "")} type={Type.IOS} swipeStartThreshold={2}>
                                                    <SwipeableListItem leadingActions={leadingActions(message.id)} blockSwipe={userId !== message.sentById || message.modifiers.includes("NoDelete")}>
                                                        {message.content}
                                                    </SwipeableListItem>
                                                </SwipeableList>
                                            </MobileView>
                                            <BrowserView>
                                                <div 
                                                    className={chatMessageContentStyle + (message.modifiers.includes("Action") ? " " + messageActionStyle : "")} 
                                                    key={message.id}
                                                    onContextMenu={(e) => onRightClick(e, message.id, message.sentById, !message.modifiers.includes("NoDelete"))}
                                                >
                                                    {message.content}
                                                </div>
                                            </BrowserView>
                                        </>
                                        
                                        
                                    )
                                })}
                                <ContextMenu model={MessageContextMenuItems} ref={cm} onHide={() => setSelectedMessageId(null)} />
                        </div>)
                })
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChannelId, messages, selectedMessageId])

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