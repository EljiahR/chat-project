import React, { useEffect, useRef, useState } from "react";
import { buttonStyleLight, usersTypingStyle } from "../../_lib/tailwindShortcuts";
import { useAppDispatch, useAppSelector } from "../../_lib/redux/hooks";
import { setMessageInput } from "../../_lib/redux/chatUiSlice";
import { notifyUserStoppedTypingHub, notifyUserTypingHub, sendMessageToConnection } from "../../_lib/signalr/signalRMiddleware";
import { addUserTyping, removeUserTyping } from "../../_lib/redux/userInfoSlice";
import { joinWithConjunction } from "../../_lib/stringHelpers";


const MessageControls: React.FC = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();
    const message = useAppSelector((state) => state.chatUi.draftMessage);
    const usersTyping = useAppSelector((state) => state.userInfo.usersTyping[state.chatUi.selectedChannelId]);
    const isConnected = useAppSelector((state) => state.chatUi.isConnected);
    const draftMessage = useAppSelector((state) => state.chatUi.draftMessage);
    const selectedChannelId = useAppSelector((state) => state.chatUi.selectedChannelId);
    const channelMembers = useAppSelector((state) => state.userInfo.channels.entities[selectedChannelId].admins
                                            .concat(state.userInfo.channels.entities[selectedChannelId].members)
                                            .concat(state.userInfo.channels.entities[selectedChannelId].owner));

    const [isTyping, setIsTyping] = useState(false);
    // DELETE THESE BEFORE MERGE
    const userId = useAppSelector((state) => state.userInfo.id);


    const handleMessageInput = (value: string) => {
        if (value.length < 251) {
            dispatch(setMessageInput(value));
            if (value.length > 0 && !isTyping) {
                setIsTyping(true);
                dispatch(notifyUserTypingHub(selectedChannelId));
                // TESTING, DELETE BEFORE MERGE
                dispatch(addUserTyping({channelId: selectedChannelId, userId: userId}))
            } else if (value.length == 0 && isTyping) {
                setIsTyping(false);
                dispatch(notifyUserStoppedTypingHub(selectedChannelId))
                // TESTING, DELETE BEFORE MERGE
                dispatch(removeUserTyping({channelId: selectedChannelId, userId: userId}))
            }
        }
    }

    const handleSendMessageEnterKey = (e: React.KeyboardEvent) => {
        if (e.key != "Enter") {
            return;
        }

        handleSendMessage();
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
                setIsTyping(false);
            } catch (e) {
                console.log(e);
            }
        }
    };

    const [ellipses, setEllipses] = useState("");

    useEffect(() => {
        if (isTyping) {
            const interval = setInterval(() => {
                setEllipses(prev => prev.length < 3 ? prev + "." : "");
            }, 700);
    
            return () => {
                clearInterval(interval);
            }
        }
    }, [isTyping]);
    
    return (
        <div id="message-controls" className="flex gap-2 relative">                
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
            {usersTyping && usersTyping.length > 0 ? 
                <div className={usersTypingStyle}>
                    {joinWithConjunction(usersTyping.map(id => channelMembers.find(cm => cm.id == id)?.userName).filter(u => u != undefined)) + (usersTyping.length > 1 ? " are " : " is ") + "typing" + ellipses}
                </div> : 
                <></>
            }          
        </div>
    );
}

export default MessageControls;