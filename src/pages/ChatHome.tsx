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
import { addNewlyCreatedChannel, sendMessageToConnection, setMessageInput, setSelectedSubMenu, startConnection } from "../_lib/redux/chatHubSlice";

interface Props {
    userInfoReceived: UserInfo
}

const ChatHome: React.FC<Props> = () => {
    const dispatch = useAppDispatch();
    const isConnected = useAppSelector((state) => state.chatHub.isConnected);
    const message = useAppSelector((state) => state.chatHub.message);
    const messages = useAppSelector((state) => state.chatHub.messages);
    const selectedChannel = useAppSelector((state) => state.chatHub.selectedChannel);
    const userName = useAppSelector((state) => state.user.userName);

    // Attempt to connect to hub on mount
    useEffect(() => {
        const previousTitle = document.title;
        document.title = "Home";
        dispatch(startConnection());

        return (() => {document.title = previousTitle;});
    }, []);

    const SendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (isConnected && message != "" && selectedChannel) {
            try {
                console.log("Sending to: ", selectedChannel);
                dispatch(sendMessageToConnection({message, channelId: selectedChannel.id}))
            } catch (e) {
                console.log(e);
            }
        }
    };

    const addNewChannel = (id: string) => {
        dispatch(addNewlyCreatedChannel(id));
    };

    // SendChannelInvite requires channelId, newUserId

    // AcceptChannelInvite requires channelId

    // SendFriendRequest requires userId

    // AcceptFriendRequest requires the initiators id

    const handleMessageInput = (value: string) => {
        if (value.length < 251) {
            dispatch(setMessageInput(value));
        }
    }

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
        if (selectedChannel == null) { 
            return [];
        }
        else {
            const channelMessages = messages[selectedChannel.id];
            if (channelMessages) {
                return channelMessages.map((channelMessage, index) => {
                    return <div className="chat-message" key={index}>{`${channelMessage.username}: ${channelMessage.content}`}</div>
                })
            }
        }
    }, [selectedChannel, messages])

    useEffect(() => {
        if (selectedChannel) {
            const previousTitle = document.title;
            document.title = selectedChannel.name;

            return (() => {document.title = previousTitle;});
        }
        
    }, [selectedChannel])
    

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
                    channelName={selectedChannel.name} 
                    chatMessages={[...chatMessages!].reverse()} 
                    handleChannelMenuDisplay={handleChannelMenuDisplay}
                    message={message} 
                    handleMessageInput={handleMessageInput} 
                    SendMessage={SendMessage}
                />
                }
            </div>
            {selectedChannel != null ? <ChannelMenu channel={selectedChannel} handleChannelMenuDisplay={handleChannelMenuDisplay} /> : null}
        </div>
        
    )
};

export default ChatHome