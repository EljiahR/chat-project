import { Button, Stack } from "react-bootstrap";
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
            <Stack id="chat" className="h-100 d-flex">
                <div id="chat-header" className="">
                    <h1 id="title">{channelName}</h1>
                    <Button onClick={() => handleChannelMenuDisplay()}>Options</Button>
                </div>
                
                <div id="chat-box" className="flex-grow-1 overflow-y-auto d-flex flex-column-reverse">
                    {chatMessages}
                </div>
                <MessageControls message={message} handleMessageInput={handleMessageInput} SendMessage={SendMessage} />
            </Stack>
    );
}

export default Chat;