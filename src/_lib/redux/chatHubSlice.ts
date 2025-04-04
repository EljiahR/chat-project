import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatHubSlice } from "./reduxTypes";
import { SubMenu } from "../pageTypes";
import { ChatHistory, Message } from "../responseTypes";

const initialState: ChatHubSlice = {
    isConnected: false,
    message: "",
    messages: {},
    selectedChannel: null,
    selectedSubMenu: SubMenu.None
}

export const chatHubSlice = createSlice({
    name: "chatHub",
    initialState,
    reducers: {
        setIsConnected: (state, action: PayloadAction<boolean>) => {
            state.isConnected = action.payload;
        },
        initializeChatHistory: (state, action: PayloadAction<ChatHistory>) => {
            action.payload.array.forEach(pastMessage => {
                state.messages[pastMessage.channelId].push(pastMessage);
            });
        },
        addNewMessage: (state, action: PayloadAction<Message>) => {
            const newMessage = action.payload;
            state.messages[newMessage.channelId].push(newMessage);
        }
    }
});
export const { setIsConnected, initializeChatHistory, addNewMessage } = chatHubSlice.actions;

export default chatHubSlice.reducer;