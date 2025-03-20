import React, { FormEvent } from "react";
import { Button, Form } from "react-bootstrap";

interface Props {
    message: string;
    handleMessageInput: (value: string) => void;
    SendMessage: (e: FormEvent) => void;
}

const MessageControls: React.FC<Props> = ({message, handleMessageInput, SendMessage}) => {
    return (
        <Form id="user-controls" onSubmit={(e) => SendMessage(e)}>                
            <Form.Group>
                <Form.Control 
                    type="text" 
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => handleMessageInput(e.target.value)}
                />
                <Button type="submit">Send Message</Button>
            </Form.Group>
            
        </Form>
    );
}

export default MessageControls;