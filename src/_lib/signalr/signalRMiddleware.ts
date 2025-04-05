import * as signalR from "@microsoft/signalr";
import { Middleware } from "@reduxjs/toolkit";
import backendUrl from "../backendUrl";
import { ChannelUser, ChatHistory, Friendship, Message, Person } from "../responseTypes";
import { addNewMessage, clearInput, initializeChatHistory, sendMessageToConnection, setIsConnected, startConnection } from "../redux/chatHubSlice";


let connection: signalR.HubConnection;

export const signalRMiddleware: Middleware = store => next => action => {  
    if (startConnection.match(action)) {
        connection = new signalR.HubConnectionBuilder()
            .withUrl(backendUrl + "/ChatHub")
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => {
                connection.on("ReceiveMessageHistory", (channelHistories: ChatHistory) => {
                    store.dispatch(initializeChatHistory(channelHistories));
                });
                
                connection.on("ReceiveMessage", (messageReceived: Message) => {
                    store.dispatch(addNewMessage(messageReceived));
                });

                // DeleteMessage return messageId
                connection.on("DeleteMessage", (messageId: string) => {

                });

                // GetChannelInvite returns ChannelUserDto
                connection.on("GetChannelInvite", (channelUser: ChannelUser) => {

                });
            
                // ReceiveNewMember returns {channelId, user: PersonDto}
                connection.on("ReceiveNewMember", ({channelId, user}: ReceiveNewMemberProp) => {
                    console.log(channelId, user)
                });
                // ReceiveFriendRequest return FriendshipDto
                connection.on("ReceiveFriendRequest", (friendship: Friendship) => {

                });
                // ReceiveNewFriend returns PersonDto
                connection.on("ReceiveNewFriend", (newFriend: Person) => {

                });

                connection.invoke("AfterConnectedAsync")
                    .catch(err => console.log("AfterConnected failed:", err));
                
                store.dispatch(setIsConnected(true));
            })
            .catch (e => {
                console.log("Connection Error: ", e)
                store.dispatch(setIsConnected(false));
            });
    }

    if (sendMessageToConnection.match(action)) {
        connection?.invoke("SendMessage", action.payload.message, action.payload.channelId);
        store.dispatch(clearInput());
    }

    return next(action);
};

interface ReceiveNewMemberProp {
    channelId: string;
    user: Person;
}