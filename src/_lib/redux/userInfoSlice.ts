import { createEntityAdapter, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Channel, ChannelUpdate, ChannelUser, Friendship, Message, Person, UserInfo } from "../responseTypes";
import { UserInfoSlice } from "./reduxTypes";

const channelsAdapter = createEntityAdapter<Channel>();
const friendsAdapter = createEntityAdapter<Person>();
const channelInvitesAdapter = createEntityAdapter<ChannelUser>();
const friendRequestsAdapter = createEntityAdapter<Friendship>();

const initialState: UserInfoSlice = {
    id: "",
    userName: "",
    channels: channelsAdapter.getInitialState(),
    friends: friendsAdapter.getInitialState(),
    channelInvites: channelInvitesAdapter.getInitialState(),
    friendRequests: friendRequestsAdapter.getInitialState(),
    usersTyping: {},
    newFriendRequest: false,
    newChannelInvite: false
}

export const userInfoSlice = createSlice({
    name: "userInfo",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserInfo>) => {
            state.id = action.payload.id;
            state.userName = action.payload.userName;
            channelsAdapter.setAll(state.channels, action.payload.channels);
            friendsAdapter.setAll(state.friends, action.payload.friends);
            channelInvitesAdapter.setAll(state.channelInvites, action.payload.channelInvites);
            friendRequestsAdapter.setAll(state.friendRequests, action.payload.friendRequests);
            if (action.payload.channelInvites.length > 0) {
                state.newChannelInvite = true;
            }
            if (action.payload.friendRequests.length > 0) {
                state.newFriendRequest = true;
            }
        },
        clearUser: (state) => {
            state.id = "";
            state.userName = "";
            channelsAdapter.removeAll(state.channels);
            friendsAdapter.removeAll(state.friends);
            channelInvitesAdapter.removeAll(state.channelInvites);
            friendRequestsAdapter.removeAll(state.friendRequests);
        },
        addFriend: (state, action: PayloadAction<Person>) => {
            friendsAdapter.addOne(state.friends, action.payload);
        },
        addChannel: (state, action: PayloadAction<Channel>) => {
            channelsAdapter.addOne(state.channels, action.payload);
        },
        updateChannel: (state, action: PayloadAction<ChannelUpdate>) => {
            const channel = state.channels.entities[action.payload.id];
            if (channel) {
                if (action.payload.isFrozen != null) {
                    channel.isFrozen = action.payload.isFrozen;
                }
                if (action.payload.name != null) {
                    channel.name = action.payload.name;
                }
            }
        },
        addUserToChannel: (state, action: PayloadAction<{channelId: string, user: Person}>) => {
            const { channelId, user } = action.payload;
            const channel = state.channels.entities[channelId];
            if (channel && !channel.members.concat(channel.admins).concat(channel.owner).some(u => u.id == user.id)) {
                channel.members.push(user);
            }
        },
        addMessageToChannel: (state, action: PayloadAction<Message>) => {
            const channel = state.channels.entities[action.payload.channelId];
            if (channel) {
                channel.channelMessages = [...channel.channelMessages, action.payload];
            } else {
                return;
            }

            const channelToUpdate = state.usersTyping[action.payload.channelId];
            if (channelToUpdate) {
                const userIndex = channelToUpdate.indexOf(action.payload.sentById);
                if (userIndex > -1) {
                    channelToUpdate.splice(userIndex, 1);
                }
            }
        },
        removeMessageFromChannel: (state, action: PayloadAction<{channelId: string, messageId: string}>) => {
            const channel = state.channels.entities[action.payload.channelId];
            if (channel) {
                const channelMessage = channel.channelMessages.find(m => m.id == action.payload.messageId);
                if (channelMessage) {
                    channelMessage.content = "User deleted message";
                    channelMessage.modifiers = ["Action", "NoDelete"];
                }
            }
        },
        addFriendRequest: (state, action: PayloadAction<Friendship>) => {
            friendRequestsAdapter.addOne(state.friendRequests, action.payload);
            state.newFriendRequest = true;
        },
        setFriendNotificationToFalse: (state) => {
            state.newFriendRequest = false;
        },
        removeFriendRequest: (state, action: PayloadAction<string>) => {
            friendRequestsAdapter.removeOne(state.friendRequests, action.payload);
        },
        addChannelInvite: (state, action: PayloadAction<ChannelUser>) => {
            channelInvitesAdapter.addOne(state.channelInvites, action.payload);
            state.newChannelInvite = true;
        },
        setChannelNotificationToFalse: (state) => {
            state.newChannelInvite = false;
        },
        removeChannelInvite: (state, action: PayloadAction<string>) => {
            channelInvitesAdapter.removeOne(state.channelInvites, action.payload);
        },
        acceptChannelInvite: (state, action: PayloadAction<Channel>) => {
            const channelInvite = channelInvitesAdapter.getSelectors((state: UserInfoSlice) => state.channelInvites).selectAll(state).filter((cu) => cu.channelId == action.payload.id);
            channelInvitesAdapter.removeOne(state.channelInvites, channelInvite[0].id);
            channelsAdapter.addOne(state.channels, action.payload);
        },
        addUserTyping: (state, action: PayloadAction<{channelId: string, userId: string}>) => {
            if (action.payload.userId == state.id) {
                return;
            }
            
            const channelToUpdate = state.usersTyping[action.payload.channelId];
            if (channelToUpdate && !channelToUpdate.includes(action.payload.userId)) {
                channelToUpdate.push(action.payload.userId);
            } else if (!channelToUpdate) {
                state.usersTyping[action.payload.channelId] = [action.payload.userId];
            }
        },
        removeUserTyping: (state, action: PayloadAction<{channelId: string, userId: string}>) => {
            const channelToUpdate = state.usersTyping[action.payload.channelId];
            if (channelToUpdate) {
                const userIndex = channelToUpdate.indexOf(action.payload.userId);
                if (userIndex > -1) {
                    channelToUpdate.splice(userIndex, 1);
                }
            }
        },
        clearChannelTyping: (state, action: PayloadAction<string>) => {
            state.usersTyping[action.payload] = [];
        }
    }
});

export const { setUser, clearUser, addFriend, addChannel, updateChannel, addUserToChannel, addMessageToChannel, removeMessageFromChannel, addFriendRequest, removeFriendRequest, addChannelInvite, removeChannelInvite, acceptChannelInvite, addUserTyping, removeUserTyping, clearChannelTyping, setFriendNotificationToFalse, setChannelNotificationToFalse } = userInfoSlice.actions;
export const {selectAll: selectAllFriends} = friendsAdapter.getSelectors((state: {userInfo: UserInfoSlice}) => state.userInfo.friends);
export const {selectAll: selectAllChannels} = channelsAdapter.getSelectors((state:{userInfo: UserInfoSlice}) => state.userInfo.channels);
export const {selectAll: selectAllFriendRequests} = friendRequestsAdapter.getSelectors((state:{userInfo: UserInfoSlice}) => state.userInfo.friendRequests);
export const {selectAll: selectAllChannelInvites} = channelInvitesAdapter.getSelectors((state:{userInfo: UserInfoSlice}) => state.userInfo.channelInvites); 
export default userInfoSlice.reducer;
