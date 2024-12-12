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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chatMessages: any[] = messages.map((message, index) => (
        <li key={index}>{message}</li>
    ))

    return (
        <div id="chat">
            <h1>Chat</h1>
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
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={SendMessage}>Send Message</button>
            <div id="chatbox">
                <ul>{chatMessages}</ul>
            </div>
        </div>
    )
};

export default Chat