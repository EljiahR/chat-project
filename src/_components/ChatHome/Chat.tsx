import { useAppSelector } from "../../_lib/redux/hooks";
import { buttonStyleBlue } from "../../_lib/tailwindShortcuts";
import MessageControls from "./MessageControls";

interface Props {
    chatMessages: JSX.Element[];
    handleChannelMenuDisplay: () => void;
    SendMessage: () => void;
}

const Chat: React.FC<Props> = ({chatMessages, handleChannelMenuDisplay, SendMessage}) => {
    const channelName = useAppSelector((state) => state.userInfo.channels.entities[state.chatUi.selectedChannelId].name);

    return (
            <div id="chat" className="h-full flex flex-col">
                <div id="chat-header" className="hidden sm:inline">
                    <h1 id="title">{channelName}</h1>
                    <button className={buttonStyleBlue} onClick={() => handleChannelMenuDisplay()}>Options</button>
                </div>
                
                <div id="chat-box" className="grow overflow-y-auto h-50 flex flex-col-reverse">
                    {chatMessages}
                </div>
                <MessageControls SendMessage={SendMessage} />
            </div>
    );
}

export default Chat;