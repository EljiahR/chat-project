import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatHubSlice } from "./reduxTypes";
import { SubMenu } from "../pageTypes";
import { Channel, ChatHistory, Message } from "../responseTypes";

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
        },
        setMessageInput: (state, action: PayloadAction<string>) => {
            state.message = action.payload;
        },
        clearMessageInput: (state) => {
            state.message = "";
        },
        addNewlyCreatedChannel: (state, action: PayloadAction<string>) => {
            state.messages[action.payload] = [];
        },
        setSelectedChannel: (state, action: PayloadAction<Channel>) => {
            state.selectedChannel = action.payload;
        },
        setSelectedSubMenu: (state, action: PayloadAction<SubMenu>) => {
            state.selectedSubMenu = action.payload == state.selectedSubMenu ? SubMenu.None : action.payload;
        }
    }
});
export const { setIsConnected, initializeChatHistory, addNewMessage, setMessageInput, clearMessageInput, addNewlyCreatedChannel, setSelectedChannel, setSelectedSubMenu } = chatHubSlice.actions;

export default chatHubSlice.reducer;

export const startConnection = createAction("chat/connect");
export const sendMessageToConnection = createAction<{message: string, channelId: string}>("chat/sendMessage");