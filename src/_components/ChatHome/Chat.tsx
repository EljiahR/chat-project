interface Props {
    channelName: string;
    chatMessages: JSX.Element[];
    handleChannelMenuDisplay: () => void;
}

const Chat: React.FC<Props> = ({channelName, chatMessages, handleChannelMenuDisplay}) => {
    return (
            <div id="chat">
                <div id="chat-header">
                    <h1 id="title">{channelName}</h1>
                    <button onClick={() => handleChannelMenuDisplay()}>Options</button>
                </div>
                
                <div id="chat-box">
                    {chatMessages}
                </div>
            </div>
    );
}

export default Chat;