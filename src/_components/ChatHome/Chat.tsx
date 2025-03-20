import { Stack } from "react-bootstrap";

interface Props {
    channelName: string;
    chatMessages: JSX.Element[];
    handleChannelMenuDisplay: () => void;
}

const Chat: React.FC<Props> = ({channelName, chatMessages, handleChannelMenuDisplay}) => {
    return (
            <Stack id="chat">
                <div id="chat-header" className="">
                    <h1 id="title">{channelName}</h1>
                    <button onClick={() => handleChannelMenuDisplay()}>Options</button>
                </div>
                
                <div id="chat-box" className="max-vh-80 vh-80">
                    {chatMessages}
                </div>
            </Stack>
    );
}

export default Chat;