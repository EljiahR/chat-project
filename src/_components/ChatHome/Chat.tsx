interface Props {
    channelName: string;
    chatMessages: JSX.Element[];
}

const Chat: React.FC<Props> = ({channelName, chatMessages}) => {
    return (
            <div id="chat">
                <h1 id="title">{channelName}</h1>
                <div id="chat-box">
                    {chatMessages}
                </div>
            </div>
    );
}

export default Chat;