import { createEntityAdapter, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Channel, ChannelUser, Friendship, Message, Person, UserInfo } from "../responseTypes";
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
    friendRequests: friendRequestsAdapter.getInitialState()
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
        addUserToChannel: (state, action: PayloadAction<{channelId: string, user: Person}>) => {
            const { channelId, user } = action.payload;
            const channel = state.channels.entities[channelId];
            if (channel && !channel.members.concat(channel.admins).concat(channel.owner).some(u => u.id == user.id)) {
                channel.members.push(user);
            }
        },
        addMessageToChannel: (state, action: PayloadAction<{channelId: string, newMessage: Message}>) => {
            const channel = state.channels.entities[action.payload.channelId];
            if (channel) {
                channel.channelMessages = [...channel.channelMessages, action.payload.newMessage];
            }
        },
        removeMessageFromChannel: (state, action: PayloadAction<{channelId: string, messageId: string}>) => {
            const channel = state.channels.entities[action.payload.channelId];
            if (channel) {
                channel.channelMessages = channel.channelMessages.filter(m => m.id != action.payload.messageId);
            }
        },
        addFriendRequest: (state, action: PayloadAction<Friendship>) => {
            friendRequestsAdapter.addOne(state.friendRequests, action.payload);
        },
        removeFriendRequest: (state, action: PayloadAction<{requestId: string}>) => {
            friendRequestsAdapter.removeOne(state.friendRequests, action.payload.requestId);
        },
        acceptFriendRequest: (state, action: PayloadAction<{requestId: string, newFriend: Person}>) => {
            friendRequestsAdapter.removeOne(state.friendRequests, action.payload.requestId);
            friendsAdapter.addOne(state.friends, action.payload.newFriend);
        },
        addChannelInvite: (state, action: PayloadAction<ChannelUser>) => {
            channelInvitesAdapter.addOne(state.channelInvites, action.payload);
        },
        removeChannelInvite: (state, action: PayloadAction<{inviteId: string}>) => {
            channelInvitesAdapter.removeOne(state.channelInvites, action.payload.inviteId);
        },
        acceptChannelInvite: (state, action: PayloadAction<{inviteId: string, newChannel: Channel}>) => {
            channelInvitesAdapter.removeOne(state.channelInvites, action.payload.inviteId);
            channelsAdapter.addOne(state.channels, action.payload.newChannel);
        }
    }
});

export const { setUser, clearUser, addFriend, addChannel, addUserToChannel, addMessageToChannel, removeMessageFromChannel, addFriendRequest, removeFriendRequest, acceptFriendRequest, addChannelInvite, removeChannelInvite, acceptChannelInvite } = userInfoSlice.actions;
export const {selectAll: selectAllFriends} = friendsAdapter.getSelectors((state: {user: UserInfoSlice}) => state.user.friends);
export const {selectAll: selectAllChannels} = channelsAdapter.getSelectors((state:{user: UserInfoSlice}) => state.user.channels);
export const {selectAll: selectAllFriendRequests} = friendRequestsAdapter.getSelectors((state:{user: UserInfoSlice}) => state.user.friendRequests);
export const {selectAll: selectAllChannelInvites} = channelInvitesAdapter.getSelectors((state:{user: UserInfoSlice}) => state.user.channelInvites); 
export default userInfoSlice.reducer;
