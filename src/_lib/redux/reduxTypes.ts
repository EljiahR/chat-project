import { EntityState } from "@reduxjs/toolkit";
import { Channel, ChannelUser, Friendship, Message, Person, UserInfo } from "../responseTypes";
import { SubMenu, SubMenuOptions } from "../pageTypes";

export interface UserInfoSlice extends Omit<UserInfo, "friends" | "channels" | "friendRequests" | "channelInvites">{
    friends: EntityState<Person, string>,
    channels: EntityState<Channel, string>,
    friendRequests: EntityState<Friendship, string>,
    channelInvites: EntityState<ChannelUser, string>
}

export interface ChatUiSlice {
    isConnected: boolean,
    message: string,
    messages: Record<string, Message[]>,
    selectedChannel: Channel | null,
    selectedSubMenu: SubMenu,
    selectedSubMenuOptions: SubMenuOptions
}