import { FormEvent, useEffect, useMemo, useState } from "react";
import * as signalR from "@microsoft/signalr";
import UserControls from "../_components/ChatHome/UserControls";
import { Channel, ChatHistory, Message, UserInfo } from "../_lib/responseTypes";
import ChannelList from "../_components/ChatHome/ChannelList";
import Chat from "../_components/ChatHome/Chat";
import HomeChannel from "../_components/ChatHome/HomeChannel";
import ChannelMenu from "../_components/ChatHome/ChannelMenu";
import backendUrl from "../_lib/backendUrl";
import { buttonStyleLight, pageChatHomeStyle } from "../_lib/tailwindShortcuts";
import { useAppSelector } from "../_lib/redux/hooks";
import { SubMenu } from "../_lib/pageTypes";

interface Props {
    userInfoReceived: UserInfo
}

const ChatHome: React.FC<Props> = () => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<Map<string, Message[]>>(new Map());
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
    const [selectedSubMenu, setSelectedSubMenu] = useState<SubMenu>(SubMenu.None);
    const userName = useAppSelector((state) => state.user.userName);

    // Attempt to connect to hub on mount
    useEffect(() => {
        const previousTitle = document.title;
        document.title = "Home";
        const getHubConntection = async () => {
            const newConnection = new signalR.HubConnectionBuilder()
                .withUrl(backendUrl + "/ChatHub")
                .withAutomaticReconnect()
                .build();

            setConnection(newConnection);
        };
        getHubConntection();
        
        return (() => {document.title = previousTitle;});
    }, []);

    //  
    useEffect(() => {
        if (connection){
            connection.start()
                .then(() => {
                    connection.on("ReceiveMessageHistory", (channelHistories: ChatHistory) => {
                        try {
                            const messageHistory: Map<string, Message[]> = new Map<string, Message[]>([]);
                            
                            Object.keys(channelHistories).forEach(channelId => {
                                
                                messageHistory.set(channelId, channelHistories[channelId] as Message[]);
                            });
                       
                            setMessages(messageHistory);
                        } catch(error) {
                            console.error("Error receiving history", error);
                        }
                    });
                    
                    connection.on("ReceiveMessage", (messageReceived: Message) => {
                        
                        setMessages(previousMessages => {
                            const updatedMessages = new Map(previousMessages);

                            const channelMessages = updatedMessages.get(messageReceived.channelId) || [];
                            updatedMessages.set(messageReceived.channelId, [...channelMessages, messageReceived]);

                            return updatedMessages;
                        });
                    });

                    // DeleteMessage return messageId

                    // GetChannelInvite returns ChannelUserDto

                    // ReceiveNewMember returns {channelId, user: PersonDto}

                    // ReceiveFriendRequest return FriendshipDto
                    
                    // ReceiveNewFriend returns PersonDto

                    connection.invoke("AfterConnectedAsync");
                })
                .catch(e => console.log("Connection Error: ", e));
        }
    }, [connection]);

    const SendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (connection && message && selectedChannel) {
            try {
                console.log("Sending to: ", selectedChannel);
                await connection.invoke("SendMessage", message, selectedChannel.id);
                setMessage("");
            } catch (e) {
                console.log(e);
            }
        }
    };

    const addNewChannel = (id: string) => {
        setMessages(previousMessages => {
            const updatedMessages = new Map(previousMessages);
            updatedMessages.set(id, []);
            return updatedMessages;
        })
    };

    // SendChannelInvite requires channelId, newUserId

    // AcceptChannelInvite requires channelId

    // SendFriendRequest requires userId

    // AcceptFriendRequest requires the initiators id

    const handleMessageInput = (value: string) => {
        if (value.length < 251) {
            setMessage(value);
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
            const channelMessages = messages.get(selectedChannel.id);
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
                <button onClick={() => setSelectedSubMenu(prev => prev == SubMenu.ChannelList ? SubMenu.None : SubMenu.ChannelList)} className={buttonStyleLight}>Channels</button>
                <button onClick={() => setSelectedSubMenu(prev => prev == SubMenu.UserInfo ? SubMenu.None : SubMenu.UserInfo)} className={buttonStyleLight}>{userName}</button>
            </div>
            <div id="navbar" className="invisible sm:visible row-start-1 sm:row-auto col-start-1 sm:col-span-1 sm:flex sm:flex-col justify-between">
                <ChannelList setSelectedChannel={setSelectedChannel} addNewChannel={addNewChannel} selectedSubMenu={selectedSubMenu} setSelectedSubMenu={setSelectedSubMenu} />
                <UserControls selectedChannel={selectedChannel} selectedSubMenu={selectedSubMenu} setSelectedSubMenu={setSelectedSubMenu}  />
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