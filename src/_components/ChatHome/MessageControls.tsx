import React, { FormEvent, useRef } from "react";
import { buttonStyleLight } from "../../_lib/tailwindShortcuts";
import { useAppDispatch, useAppSelector } from "../../_lib/redux/hooks";
import { setMessageInput } from "../../_lib/redux/chatUiSlice";

interface Props {
    SendMessage: (e: FormEvent) => void;
}

const MessageControls: React.FC<Props> = ({ SendMessage }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();
    const message = useAppSelector((state) => state.chatUi.draftMessage);

    const handleMessageInput = (value: string) => {
        if (value.length < 251) {
            dispatch(setMessageInput(value));
        }
    }

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