import { FormEvent, useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import "./Chat.css";
import NavBar from "../_components/NavBar";
import { Message, UserInfo } from "../_lib/responseTypes";


const Chat = ({userName}: UserInfo) => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<string[]>([]);

    // Connect to chat hub on mount and retrieve all messages
    useEffect(() => {
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
                    connection.on("ReceiveChatHistory", (messages: Message[]) => {
                        setMessages(messages.map(message => {
                            return `${message.username}: ${message.content}`
                        }));
                    });
                    connection.on("ReceiveMessage", (user, message) => {
                        setMessages(previousMessages => [...previousMessages, `${user}: ${message}`]); 
                    });
                })
                .catch(e => console.log("Connection Error: " + e));
        }
    }, [connection]);

    const SendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (connection && message) {
            try {
                await connection.invoke("SendMessage", userName, message);
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chatMessages: any[] = messages.map((message, index) => (
        <div className="chat-message" key={index}>{message}</div>
    ))

    return (
        <div id="chat-app">
            <NavBar />
            <div id="chat">
                <h1 id="title">Chat</h1>
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
            </div>
        </div>
        
    )
};

export default Chat