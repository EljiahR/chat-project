import { FormEvent, useEffect, useMemo, useState } from "react";
import * as signalR from "@microsoft/signalr";
import "../_styles/Chat.css"
import NavBar from "../_components/NavBar";
import { Channel, Message, UserInfo } from "../_lib/responseTypes";
import ChannelList from "../_components/ChannelList";

interface ChannelHistory {
    channelId: number,
    messages: Message[]
}

const Chat = ({userName, channels}: UserInfo) => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<Map<number, Message[]>>(new Map([]));
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

    // Attempt to connect to hub on mount
    useEffect(() => {
        console.log("userinfo")
        console.log(userName);
        const getHubConntection = async () => {
            const newConnection = new signalR.HubConnectionBuilder()
                .withUrl("https://localhost:7058/ChatHub")
                .withAutomaticReconnect()
                .build();

            setConnection(newConnection);
        };
        getHubConntection();
    }, []);

    //  
    useEffect(() => {
        if (connection){
            connection.start()
                .then(() => {
                    connection.on("ReceiveChatHistory", (channelHistories: ChannelHistory[]) => {
                        const messageHistory: Map<number, Message[]> = new Map([]);
                        channelHistories.forEach(channelHistory => {
                            messageHistory.set(channelHistory.channelId, channelHistory.messages);
                        });

                        setMessages(messageHistory);
                    });
                    
                    connection.on("ReceiveMessage", (messageReceived: Message) => {
                        const previousHistory = new Map(messages);
                        const previousMessages = previousHistory.get(messageReceived.channelId);
                        if (previousMessages) {
                            previousHistory.set(messageReceived.channelId, [...previousMessages, messageReceived]);
                        } else {
                            previousHistory.set(messageReceived.channelId, [messageReceived]);
                        }
                        setMessages(previousHistory); 
                    });
                })
                .catch(e => console.log("Connection Error: " + e));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const handleMessageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    

    return (
        <div id="chat-app">
            <NavBar />
            <ChannelList channels={channels} setSelectedChannel={setSelectedChannel} />
            <div id="chat">
                {selectedChannel == null ? 
                <div><h2>Home</h2></div> :
                <>
                    <h1 id="title">{selectedChannel == null ? "Home" : selectedChannel.name}</h1>
                    <div id="chatbox">
                        {chatMessages}
                    </div>
                    <form id="user-controls" onSubmit={(e) => SendMessage(e)}>                
                        <input 
                            type="text" 
                            placeholder="Type your message..."
                            value={message}
                            onChange={(e) => handleMessageInput(e)}
                        />
                        <button type="submit">Send Message</button>
                    </form>
                </>}
            </div>
        </div>
        
    )
};

export default Chat