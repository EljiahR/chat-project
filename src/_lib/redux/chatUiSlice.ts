import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatUiSlice } from "./reduxTypes";
import { SubMenu, SubMenuOptions } from "../pageTypes";
import { Channel } from "../responseTypes";

const initialState: ChatUiSlice = {
    isConnected: false,
    draftMessage: "",
    selectedChannel: null,
    selectedSubMenu: SubMenu.None,
    selectedSubMenuOptions: SubMenuOptions.None
}

export const chatUiSlice = createSlice({
    name: "chatUiHub",
    initialState,
    reducers: {
        clearChatHub: (state) => {
            state.isConnected = false;
            state.draftMessage = "";
            state.selectedChannel = null;
            state.selectedSubMenu = SubMenu.None;
            state.selectedSubMenuOptions = SubMenuOptions.None;
        },
        setIsConnected: (state, action: PayloadAction<boolean>) => {
            state.isConnected = action.payload;
        },
        setMessageInput: (state, action: PayloadAction<string>) => {
            state.draftMessage = action.payload;
        },
        clearMessageInput: (state) => {
            state.draftMessage = "";
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
export const { clearChatHub, setIsConnected, setMessageInput, clearMessageInput, setSelectedChannel, setSelectedSubMenu, setSelectedSubMenuOption } = chatUiSlice.actions;

export default chatUiSlice.reducer;

export const startConnection = createAction("chat/connect");
export const sendMessageToConnection = createAction<{message: string, channelId: string}>("chat/sendMessage");