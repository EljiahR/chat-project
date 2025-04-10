import { EntityState } from "@reduxjs/toolkit";
import { Channel, ChannelUser, Friendship, Person, UserInfo } from "../responseTypes";
import { SubMenu, SubMenuOptions } from "../pageTypes";

export interface UserInfoSlice extends Omit<UserInfo, "friends" | "channels" | "friendRequests" | "channelInvites">{
    friends: EntityState<Person, string>,
    channels: EntityState<Channel, string>,
    friendRequests: EntityState<Friendship, string>,
    channelInvites: EntityState<ChannelUser, string>
}

export interface ChatUiSlice {
    isConnected: boolean,
    draftMessage: string,
    selectedChannelId: string,
    selectedSubMenu: SubMenu,
    selectedSubMenuOptions: SubMenuOptions
}