import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatHubSlice } from "./reduxTypes";
import { SubMenu, SubMenuOptions } from "../pageTypes";
import { Channel, ChatHistory, Message } from "../responseTypes";

const initialState: ChatHubSlice = {
    isConnected: false,
    message: "",
    messages: {},
    selectedChannel: null,
    selectedSubMenu: SubMenu.None,
    selectedSubMenuOptions: SubMenuOptions.None
}

export const chatHubSlice = createSlice({
    name: "chatHub",
    initialState,
    reducers: {
        clearChatHub: (state) => {
            state.isConnected = false;
            state.message = "";
            state.messages = {};
            state.selectedChannel = null;
            state.selectedSubMenu = SubMenu.None;
            state.selectedSubMenuOptions = SubMenuOptions.None;
        },
        setIsConnected: (state, action: PayloadAction<boolean>) => {
            state.isConnected = action.payload;
        },
        initializeChatHistory: (state, action: PayloadAction<ChatHistory>) => {
            for (const [channelId, messageHistory] of Object.entries(action.payload)) {
                state.messages[channelId] = messageHistory;
            };
        },
        addNewMessage: (state, action: PayloadAction<Message>) => {
            const newMessage = action.payload;
            state.messages[newMessage.channelId].push(newMessage);
        },
        deleteMessageFromHub: (state, action: PayloadAction<{channelId: string, messageId: string}>) => {
            state.messages[action.payload.channelId].filter(m => m.id != action.payload.messageId);
        },
        setMessageInput: (state, action: PayloadAction<string>) => {
            state.message = action.payload;
        },
        clearMessageInput: (state) => {
            state.message = "";
        },
        addNewlyCreatedChannel: (state, action: PayloadAction<string>) => {
            state.messages[action.payload] = [];
            state.selectedSubMenu = SubMenu.None;
            state.selectedSubMenuOptions = SubMenuOptions.None;
        },
        setSelectedChannel: (state, action: PayloadAction<Channel>) => {
            state.selectedChannel = action.payload;
            state.selectedSubMenu = SubMenu.None;
            state.selectedSubMenuOptions = SubMenuOptions.None;
        },
        setSelectedSubMenu: (state, action: PayloadAction<SubMenu>) => {
            state.selectedSubMenu = action.payload == state.selectedSubMenu ? SubMenu.None : action.payload;
            state.selectedSubMenuOptions = SubMenuOptions.None;
        },
        setSelectedSubMenuOption: (state, action: PayloadAction<SubMenuOptions>) => {
            state.selectedSubMenuOptions = action.payload == state.selectedSubMenuOptions ? SubMenuOptions.None : action.payload;
        }
    }
});
export const { clearChatHub, setIsConnected, initializeChatHistory, addNewMessage, deleteMessageFromHub, setMessageInput, clearMessageInput, addNewlyCreatedChannel, setSelectedChannel, setSelectedSubMenu, setSelectedSubMenuOption } = chatHubSlice.actions;

export default chatHubSlice.reducer;

export const startConnection = createAction("chat/connect");
export const sendMessageToConnection = createAction<{message: string, channelId: string}>("chat/sendMessage");