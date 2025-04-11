import { FormEvent, useEffect, useMemo } from "react";
import UserControls from "../_components/ChatHome/UserControls";
import { UserInfo } from "../_lib/responseTypes";
import ChannelList from "../_components/ChatHome/ChannelList";
import Chat from "../_components/ChatHome/Chat";
import HomeChannel from "../_components/ChatHome/HomeChannel";
import ChannelMenu from "../_components/ChatHome/ChannelMenu";
import { buttonStyleLight, pageChatHomeStyle } from "../_lib/tailwindShortcuts";
import { useAppDispatch, useAppSelector } from "../_lib/redux/hooks";
import { SubMenu } from "../_lib/pageTypes";
import { setSelectedSubMenu } from "../_lib/redux/chatUiSlice";
import { messageSortByDateReverse } from "../_lib/sortFunctions";
import { closeConnection, sendMessageToConnection, startConnection } from "../_lib/signalr/signalRMiddleware";

interface Props {
    userInfoReceived: UserInfo
}

const ChatHome: React.FC<Props> = () => {
    const dispatch = useAppDispatch();
    const isConnected = useAppSelector((state) => state.chatUi.isConnected);
    const draftMessage = useAppSelector((state) => state.chatUi.draftMessage);
    const selectedChannelId = useAppSelector((state) => state.chatUi.selectedChannelId);
    const selectedChannel = useAppSelector((state) => state.userInfo.channels.entities[selectedChannelId]);
    const messages = useAppSelector((state) => state.chatUi.selectedChannelId != "" ? state.userInfo.channels.entities[selectedChannelId].channelMessages : []);
    const userName = useAppSelector((state) => state.userInfo.userName);

    // Attempt to connect to hub on mount
    useEffect(() => {
        const previousTitle = document.title;
        document.title = "Home";
        dispatch(startConnection());

        return (() => {
            document.title = previousTitle;
            dispatch(closeConnection());
        });
    }, []);

    const SendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (isConnected && draftMessage != "" && selectedChannelId != "") {
            try {
                console.log("Sending to: ", selectedChannelId);
                dispatch(sendMessageToConnection({message: draftMessage, channelId: selectedChannelId}))
            } catch (e) {
                console.log(e);
            }
        }
    };

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
                return channelMessages.map((channelMessage, index) => {
                    return <div className="chat-message" key={index}>{`${channelMessage.username}: ${channelMessage.content}`}</div>
                })
            }
        }
    }, [selectedChannelId, messages])

    useEffect(() => {
        if (selectedChannelId != "") {
            const previousTitle = document.title;
            document.title = selectedChannel.name;

            return (() => {document.title = previousTitle;});
        }
        
    }, [selectedChannelId])
    

    return (
        <div id="chat-main" className={pageChatHomeStyle}>
            <div id="navbar-controls" className="row-span-1 row-start-1 sm:row-auto col-start-1 sm:hidden flex justify-between">
                <button onClick={() => dispatch(setSelectedSubMenu(SubMenu.ChannelList))} className={buttonStyleLight}>Channels</button>
                <button onClick={() => dispatch(setSelectedSubMenu(SubMenu.UserInfo))} className={buttonStyleLight}>{userName}</button>
            </div>
            <div id="navbar" className="invisible sm:visible row-start-1 sm:row-auto col-start-1 sm:col-span-1 sm:flex sm:flex-col justify-between">
                <ChannelList  />
                <UserControls />
            </div>
            <div id="chat-container" className="row-span-11 sm:row-span-1 sm:col-span-3 h-full">
                {selectedChannel == null ? 
                <HomeChannel /> 
                :
                <Chat 
                    chatMessages={chatMessages != null ? [...chatMessages!].reverse() : []} 
                    handleChannelMenuDisplay={handleChannelMenuDisplay}
                    SendMessage={SendMessage}
                />
                }
            </div>
            {selectedChannel != null ? <ChannelMenu channel={selectedChannel} handleChannelMenuDisplay={handleChannelMenuDisplay} /> : null}
        </div>
        
    )
};

export default ChatHome