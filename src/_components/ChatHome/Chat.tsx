import { buttonStyleBlue } from "../../_lib/tailwindShortcuts";
import MessageControls from "./MessageControls";
import { FormEvent } from "react";

interface Props {
    channelName: string;
    chatMessages: JSX.Element[];
    handleChannelMenuDisplay: () => void;
    message: string;
    handleMessageInput: (value: string) => void;
    SendMessage: (e: FormEvent) => void;
}

const Chat: React.FC<Props> = ({channelName, chatMessages, handleChannelMenuDisplay, message, handleMessageInput, SendMessage}) => {
    return (
            <div id="chat" className="h-full flex flex-col">
                <div id="chat-header" className="">
                    <h1 id="title">{channelName}</h1>
                    <button className={buttonStyleBlue} onClick={() => handleChannelMenuDisplay()}>Options</button>
                </div>
                
                <div id="chat-box" className="grow overflow-y-auto h-50 flex flex-col-reverse">
                    {chatMessages}
                </div>
                <MessageControls message={message} handleMessageInput={handleMessageInput} SendMessage={SendMessage} />
            </div>
    );
}

export default Chat;