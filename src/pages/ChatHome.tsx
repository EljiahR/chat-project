import { FormEvent, useEffect, useMemo, useState } from "react";
import * as signalR from "@microsoft/signalr";
import NavBar from "../_components/ChatHome/NavBar";
import { Channel, Message, UserInfo } from "../_lib/responseTypes";
import ChannelList from "../_components/ChatHome/ChannelList";
import Chat from "../_components/ChatHome/Chat";
import HomeChannel from "../_components/ChatHome/HomeChannel";
import ChannelMenu from "../_components/ChatHome/ChannelMenu";
import backendUrl from "../_lib/backendUrl";
import { pageChatHomeStyle } from "../_lib/tailwindShortcuts";

interface ChatHistory {
    [channelId: string]: Message[];
}

interface Props {
    userInfoReceived: UserInfo
}

const ChatHome: React.FC<Props> = () => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<Map<string, Message[]>>(new Map());
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

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
    }

    const handleMessageInput = (value: string) => {
        if (value.length < 251) {
            setMessage(value);
        }
    }

    const handleChannelMenuDisplay = (forceClose = false) => {
        const menu = document.querySelector("#channel-menu") as HTMLDivElement;
        if (menu == null) return;

        if (!menu.hidden || forceClose) {
            menu.hidden = true;
        } else {
            menu.hidden = false;
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
            <div id="sidebar" className="col-span-1 flex flex-col justify-between">
                <ChannelList setSelectedChannel={setSelectedChannel} addNewChannel={addNewChannel} />
                <NavBar selectedChannel={selectedChannel}  />
            </div>
            <div id="chat-container" className="col-span-3">
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
            {selectedChannel != null ? <ChannelMenu channel={selectedChannel} /> : null}
        </div>
        
    )
};

export default ChatHome