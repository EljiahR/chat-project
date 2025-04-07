import * as signalR from "@microsoft/signalr";
import { Middleware } from "@reduxjs/toolkit";
import backendUrl from "../backendUrl";
import { ChannelUser, Friendship, Message, Person } from "../responseTypes";
import { clearMessageInput, sendMessageToConnection, setIsConnected, startConnection } from "../redux/chatUiSlice";
import { addChannelInvite, addFriend, addFriendRequest, addMessageToChannel, addUserToChannel, removeMessageFromChannel } from "../redux/userInfoSlice";


let connection: signalR.HubConnection;

export const signalRMiddleware: Middleware = store => next => action => {  
    if (startConnection.match(action)) {
        connection = new signalR.HubConnectionBuilder()
            .withUrl(backendUrl + "/ChatHub")
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => {
                connection.on("ReceiveMessage", (messageReceived: Message) => {
                    store.dispatch(addMessageToChannel(messageReceived));
                });

                // DeleteMessage return {channelId, messageId}
                connection.on("DeleteMessage", ({channelId, messageId}: DeleteMessageProps) => {
                    store.dispatch(removeMessageFromChannel({channelId, messageId}));
                });

                // GetChannelInvite returns ChannelUserDto
                connection.on("GetChannelInvite", (channelUser: ChannelUser) => {
                    store.dispatch(addChannelInvite(channelUser));
                });
            
                // ReceiveNewMember returns {channelId, user: PersonDto}
                connection.on("ReceiveNewMember", ({channelId, user}: ReceiveNewMemberProps) => {
                    store.dispatch(addUserToChannel({channelId, user}));
                });
                // ReceiveFriendRequest return FriendshipDto
                connection.on("ReceiveFriendRequest", (friendship: Friendship) => {
                    store.dispatch(addFriendRequest(friendship));
                });
                // ReceiveNewFriend returns PersonDto
                connection.on("ReceiveNewFriend", (newFriend: Person) => {
                    store.dispatch(addFriend(newFriend));
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
        store.dispatch(clearMessageInput());
    }

     // Accept friend

     // Accept channel invite

    return next(action);
};

interface ReceiveNewMemberProps {
    channelId: string;
    user: Person;
}

interface DeleteMessageProps {
    channelId: string;
    messageId: string;
}