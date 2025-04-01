import { createEntityAdapter, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Channel, ChannelInvite, FriendRequest, Person, UserInfo } from "../responseTypes";
import { UserInfoSlice } from "./reduxTypes";

const channelsAdapter = createEntityAdapter<Channel>();
const friendsAdapter = createEntityAdapter<Person>();
const channelInvitesAdapter = createEntityAdapter<ChannelInvite>();
const friendRequestsAdapter = createEntityAdapter<FriendRequest>();

const initialState: UserInfoSlice = {
    id: "",
    userName: "",
    channels: channelsAdapter.getInitialState(),
    friends: friendsAdapter.getInitialState(),
    channelInvites: channelInvitesAdapter.getInitialState(),
    friendRequests: friendRequestsAdapter.getInitialState()
}

export const userSlice = createSlice({
    name: "user",
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
        }
    }
})

export const { setUser, clearUser, addFriend, addChannel, addUserToChannel } = userSlice.actions;
export const {selectAll: selectAllFriends} = friendsAdapter.getSelectors((state: {user: UserInfoSlice}) => state.user.friends);
export const {selectAll: selectAllChannels} = channelsAdapter.getSelectors((state:{user: UserInfoSlice}) => state.user.channels);
export const {selectAll: selectAllFriendRequests} = friendRequestsAdapter.getSelectors((state:{user: UserInfoSlice}) => state.user.friendRequests);
export default userSlice.reducer;