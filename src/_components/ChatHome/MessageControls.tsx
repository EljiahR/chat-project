import React, { FormEvent, ChangeEvent } from "react";

interface Props {
    message: string;
    handleMessageInput: (e: ChangeEvent<HTMLInputElement>) => void;
    SendMessage: (e: FormEvent) => void;
}

const MessageControls: React.FC<Props> = ({message, handleMessageInput, SendMessage}) => {
    return (
        <form id="user-controls" onSubmit={(e) => SendMessage(e)}>                
            <input 
                type="text" 
                placeholder="Type your message..."
                value={message}
                onChange={(e) => handleMessageInput(e)}
            />
            <button type="submit">Send Message</button>
        </form>
    );
}

export default MessageControls;