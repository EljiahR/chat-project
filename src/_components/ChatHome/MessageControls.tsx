import React, { useRef } from "react";
import { buttonStyleLight } from "../../_lib/tailwindShortcuts";
import { useAppDispatch, useAppSelector } from "../../_lib/redux/hooks";
import { setMessageInput } from "../../_lib/redux/chatUiSlice";
import { sendMessageToConnection } from "../../_lib/signalr/signalRMiddleware";


const MessageControls: React.FC = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();
    const message = useAppSelector((state) => state.chatUi.draftMessage);
    const usersTyping = useAppSelector((state) => state.userInfo.usersTyping[state.chatUi.selectedChannelId]);
    const isConnected = useAppSelector((state) => state.chatUi.isConnected);
    const draftMessage = useAppSelector((state) => state.chatUi.draftMessage);
    const selectedChannelId = useAppSelector((state) => state.chatUi.selectedChannelId);

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

    const SendMessage = async () => {
        if (isConnected && draftMessage != "" && selectedChannelId != "") {
            try {
                console.log("Sending to: ", selectedChannelId);
                dispatch(sendMessageToConnection({message: draftMessage, channelId: selectedChannelId}))
            } catch (e) {
                console.log(e);
            }
        }
    };
    
    return (
        <div id="message-controls" className="flex gap-2">                
            <input 
                id="message-controls-text"
                type="text" 
                placeholder="Type your message..."
                value={message}
                onChange={(e) => handleMessageInput(e.target.value)}
                onKeyDown={(e) => handleSendMessageEnterKey(e)}
                className="grow-1"
                ref={inputRef}
            />
            <button className={buttonStyleLight} type="button" onClick={handleSendMessage}>Send</button>  
            {usersTyping.length > 0 ? 
            <div>
                {usersTyping.join(" ")}
            </div> : 
            <></>}          
        </div>
    );
}

export default MessageControls;