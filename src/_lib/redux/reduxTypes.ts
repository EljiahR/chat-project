import { EntityState } from "@reduxjs/toolkit";
import { Channel, ChannelUser, Friendship, Person, UserInfo, UsersTyping } from "../responseTypes";
import { SubMenu, SubMenuOptions } from "../pageTypes";

export interface UserInfoSlice extends Omit<UserInfo, "friends" | "channels" | "friendRequests" | "channelInvites">{
    friends: EntityState<Person, string>,
    channels: EntityState<Channel, string>,
    friendRequests: EntityState<Friendship, string>,
    channelInvites: EntityState<ChannelUser, string>,
    usersTyping: UsersTyping,
    newFriendRequest: boolean,
    newChannelInvite: boolean
}

export interface ChatUiSlice {
    isConnected: boolean,
    draftMessage: string,
    selectedChannelId: string,
    selectedSubMenu: SubMenu,
    selectedSubMenuOptions: SubMenuOptions,
<<<<<<< HEAD
    accessToken: string | null
=======
}

export interface AuthSlice {
    accessToken: string | null;
>>>>>>> 8d54bb1 (Moved access token to redux store, moved AuthProvider to inside of store provider)
}
