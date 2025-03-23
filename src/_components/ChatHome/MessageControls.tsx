import React, { FormEvent } from "react";
import { buttonStyleLight } from "../../_lib/tailwindShortcuts";

interface Props {
    message: string;
    handleMessageInput: (value: string) => void;
    SendMessage: (e: FormEvent) => void;
}

const MessageControls: React.FC<Props> = ({message, handleMessageInput, SendMessage}) => {
    return (
        <form id="message-controls" onSubmit={(e) => SendMessage(e)} className="flex gap-2">                
            <input 
                type="text" 
                placeholder="Type your message..."
                value={message}
                onChange={(e) => handleMessageInput(e.target.value)}
                className="grow-1"
            />
            <button className={buttonStyleLight} type="submit">Send</button>            
        </form>
    );
}

export default MessageControls;