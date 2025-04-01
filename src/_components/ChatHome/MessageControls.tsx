import React, { FormEvent, useRef } from "react";
import { buttonStyleLight } from "../../_lib/tailwindShortcuts";

interface Props {
    message: string;
    handleMessageInput: (value: string) => void;
    SendMessage: (e: FormEvent) => void;
}

const MessageControls: React.FC<Props> = ({message, handleMessageInput, SendMessage}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        SendMessage(e);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }
    
    return (
        <form id="message-controls" onSubmit={(e) => handleSendMessage(e)} className="flex gap-2">                
            <input 
                id="message-controls-text"
                type="text" 
                placeholder="Type your message..."
                value={message}
                onChange={(e) => handleMessageInput(e.target.value)}
                className="grow-1"
                ref={inputRef}
            />
            <button className={buttonStyleLight} type="submit">Send</button>            
        </form>
    );
}

export default MessageControls;