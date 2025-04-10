import React, { useRef } from "react";
import { buttonStyleLight } from "../../_lib/tailwindShortcuts";
import { useAppDispatch, useAppSelector } from "../../_lib/redux/hooks";
import { setMessageInput } from "../../_lib/redux/chatUiSlice";

interface Props {
    SendMessage: () => void;
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

    const handleSendMessageEnterKey = (e: React.KeyboardEvent) => {
        if (e.key != "Enter") {
            return;
        }

        SendMessage();
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }

    const handleSendMessage = () => {
        SendMessage();
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }
    
    return (
        <div id="message-controls" className="flex gap-2">                
            <input 
                id="message-controls-text"
                type="text" 
                placeholder="Type your message..."
                value={message}
                onChange={(e) => handleMessageInput(e.target.value)}
                onKeyDown={(e) => handleSendMessageEnterKey(e, )}
                className="grow-1"
                ref={inputRef}
            />
            <button className={buttonStyleLight} type="button" onClick={handleSendMessage}>Send</button>            
        </div>
    );
}

export default MessageControls;