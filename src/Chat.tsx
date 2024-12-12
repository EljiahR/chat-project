import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import "./Chat.css";

const Chat: React.FC = () => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [username, setUsername] = useState<string>("Jim");
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<string[]>([]);

    // Connect to chat hub on mount
    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7058/ChatHub")
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
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

    const SendMessage = async () => {
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
        <div id="chat">
            <h1 id="title">Chat</h1>
            <div id="chatbox">
                {chatMessages}
            </div>
            <div id="user-controls">
                <label htmlFor="username">Username: </label>
                <input 
                    type="text"
                    id="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                
                <input 
                    type="text" 
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => handleMessageInput(e)}
                />
                <button onClick={SendMessage}>Send Message</button>
            </div>
        </div>
    )
};

export default Chat