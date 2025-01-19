import { FormEvent, useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import "./Chat.css";
import NavBar from "./_components/NavBar";
import instance from "./_lib/axiosBase";

interface Starter {
    username: string,
    messages: Message
};

interface Message {
    id: number,
    username: string,
    content: string,
    sentAt: Date
}

const Chat: React.FC = () => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [username, setUsername] = useState<string>("");
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
        
        const getAllMessages = async () => {
            try {
                const response = await instance.get("/Message/ChatStarter", {withCredentials: true})
            
                console.log(response.data);
                setMessages(response.data.map((x: Starter): string => {
                    return `${x.messages.username}: ${x.messages.content}`;
                }));
                setUsername(response.data.username);
            } catch (error) {
                console.error(error);
            }
        }
        
        getHubConntection();
        getAllMessages();
    }, []);

    // 
    useEffect(() => {
        if (connection){
            connection.start()
                .then(() => {
                    connection.on("ReceiveMessage", (user, message) => {
                        setMessages(previousMessages => [...previousMessages, `${user}: ${message}`]);
                        
                    })
                })
                .catch(e => console.log("Connection Error: " + e));
        }
    }, [connection]);

    const SendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (connection && message) {
            try {
                await connection.invoke("SendMessage", username, message);
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