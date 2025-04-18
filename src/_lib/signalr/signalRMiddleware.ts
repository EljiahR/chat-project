import * as signalR from "@microsoft/signalr";
import { createAction, Middleware } from "@reduxjs/toolkit";
import backendUrl from "../backendUrl";
import { Channel, ChannelUser, Friendship, Message, Person } from "../responseTypes";
import { clearMessageInput, setIsConnected } from "../redux/chatUiSlice";
import { acceptChannelInvite, addChannelInvite, addFriend, addFriendRequest, addMessageToChannel, addUserToChannel, removeFriendRequest, removeMessageFromChannel } from "../redux/userInfoSlice";


let connection: signalR.HubConnection;

export const signalRMiddleware: Middleware = store => next => action => {  
    if (closeConnection.match(action)) {
        connection?.stop();
    }
    
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
                connection.on("JoinChannel", (newChannel: Channel) => {
                    store.dispatch(acceptChannelInvite(newChannel));
                })
                
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
        return next(action);
    }

    // Send friend request
    if (sendFriendRequestHub.match(action)) {
        connection?.invoke("SendFriendRequest", action.payload);
        return next(action);
    }

     // Accept friend
     if (acceptFriendRequestHub.match(action)) {
        connection?.invoke("AcceptFriendRequest", action.payload.initiatorId);
        store.dispatch(removeFriendRequest(action.payload.id));
        return next(action);
     }

    // Send channel invite
    if (sendChannelInviteHub.match(action)) {
        connection?.invoke("SendChannelInvite", action.payload.channelId, action.payload.newUserId);
        return next(action);
    }

     // Accept channel invite
     if (acceptChannelInviteHub.match(action)) {
        connection?.invoke("AcceptChannelInvite", action.payload);
        return next(action);
     }

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

export const startConnection = createAction("chat/connect");
export const closeConnection = createAction("chat/disconnect");
export const sendMessageToConnection = createAction<{message: string, channelId: string}>("chat/sendMessage");
export const sendFriendRequestHub = createAction<string>("chat/sendFriendRequest");
export const acceptFriendRequestHub = createAction<Friendship>("chat/acceptFriendRequest");
export const sendChannelInviteHub = createAction<{channelId: string, newUserId: string}>("chat/sendChannelInvite");
export const acceptChannelInviteHub = createAction<string>("chat/acceptChannelInvite");