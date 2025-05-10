import { configureStore } from "@reduxjs/toolkit";
import userInfoReducer from "./userInfoSlice";
import chatUiReducer from "./chatUiSlice";
import authReducer from "./authSlice";
import { signalRMiddleware } from "../signalr/signalRMiddleware";

export const store = configureStore({
    reducer: {
        userInfo: userInfoReducer,
        chatUi: chatUiReducer,
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(signalRMiddleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch