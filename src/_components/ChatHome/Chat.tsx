import { Button, Card, Stack } from "react-bootstrap";

interface Props {
    channelName: string;
    chatMessages: JSX.Element[];
    handleChannelMenuDisplay: () => void;
}

const Chat: React.FC<Props> = ({channelName, chatMessages, handleChannelMenuDisplay}) => {
    return (
            <Stack id="chat" className="max-vh-75 d-flex flex-column">
                <div id="chat-header" className="">
                    <h1 id="title">{channelName}</h1>
                    <Button onClick={() => handleChannelMenuDisplay()}>Options</Button>
                </div>
                
                <Card id="chat-box" className="flex-grow-1 overflow-y-auto">
                    <Card.Body>
                        {chatMessages}
                    </Card.Body>
                </Card>
            </Stack>
    );
}

export default Chat;