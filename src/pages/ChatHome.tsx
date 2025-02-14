import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import * as signalR from "@microsoft/signalr";
import "../_styles/ChatHome.css"
import NavBar from "../_components/ChatHome/NavBar";
import { Channel, Message, UserInfo } from "../_lib/responseTypes";
import ChannelList from "../_components/ChatHome/ChannelList";
import MessageControls from "../_components/ChatHome/MessageControls";
import Chat from "../_components/ChatHome/Chat";
import HomeChannel from "../_components/ChatHome/HomeChannel";

interface ChatHistory {
    [channelId: number]: Message[];
}

interface Props {
    userInfo: UserInfo
}

const ChatHome: React.FC<Props> = ({userInfo}) => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<Map<number, Message[]>>(new Map());
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

    // Attempt to connect to hub on mount
    useEffect(() => {
        const previousTitle = document.title;
        document.title = "Home";
        const getHubConntection = async () => {
            const newConnection = new signalR.HubConnectionBuilder()
                .withUrl("https://localhost:7058/ChatHub")
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
                            const messageHistory: Map<number, Message[]> = new Map<number, Message[]>([]);
                            
                            Object.keys(channelHistories).forEach(channelId => {
                                const id = parseInt(channelId)
                                messageHistory.set(id, channelHistories[id] as Message[]);
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
                .catch(e => console.log("Connection Error: " + e));
        }
    }, [connection]);

    const SendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (connection && message && selectedChannel) {
            try {
                console.log("Sending to: " + selectedChannel);
                await connection.invoke("SendMessage", message, selectedChannel.id);
                setMessage("");
            } catch (e) {
                console.log(e);
            }
        }
    };

    const handleMessageInput = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length < 251) {
            setMessage(e.target.value);
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
        <div id="chat-main">
            <div id="sidebar">
                <ChannelList channels={userInfo.channels ?? []} setSelectedChannel={setSelectedChannel} />
                <NavBar />
            </div>
            <div id="chat-container">
                {selectedChannel == null ? 
                <HomeChannel /> :
                <>
                    <Chat channelName={selectedChannel.name} chatMessages={chatMessages!.reverse()} />
                    <MessageControls message={message} handleMessageInput={handleMessageInput} SendMessage={SendMessage}  />
                </>}
            </div>
        </div>
        
    )
};

export default ChatHome