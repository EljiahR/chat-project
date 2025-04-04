import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import chatHubReducer from "./chatHubSlice";
import { signalRMiddleware } from "../signalr/signalRMiddleware";

export const store = configureStore({
    reducer: {
        user: userReducer,
        chatHub: chatHubReducer
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(signalRMiddleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch