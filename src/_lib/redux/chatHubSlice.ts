import { createSlice } from "@reduxjs/toolkit";
import { ChatHubSlice } from "./reduxTypes";
import { SubMenu } from "../pageTypes";

const initialState: ChatHubSlice = {
    message: "",
    messages: {},
    selectedChannel: null,
    selectedSubMenu: SubMenu.None
}

export const chatHubSlice = createSlice({
    name: "chatHub",
    initialState,
    reducers: {

    }
});

export default chatHubSlice.reducer;