import { useAppSelector } from "../../_lib/redux/hooks";
import { buttonStyleBlue } from "../../_lib/tailwindShortcuts";
import MessageControls from "./MessageControls";

interface Props {
    chatMessages: JSX.Element[];
    handleChannelMenuDisplay: () => void;
}

const Chat: React.FC<Props> = ({chatMessages, handleChannelMenuDisplay}) => {
    const channelName = useAppSelector((state) => state.userInfo.channels.entities[state.chatUi.selectedChannelId].name);

    return (
            <div id="chat" className="h-full flex flex-col gap-1">
                <div id="chat-header" className="hidden sm:inline">
                    <h1 id="title">{channelName}</h1>
                    <button className={buttonStyleBlue} onClick={() => handleChannelMenuDisplay()}>Options</button>
                </div>
                
                <div id="chat-box" className="grow overflow-y-auto overflow-x-hidden h-50 flex flex-col-reverse pb-5 bg-gray-700 rounded p-1 inset-shadow-sm inset-shadow-black">
                    {chatMessages}
                </div>
                <MessageControls />
            </div>
    );
}

export default Chat;