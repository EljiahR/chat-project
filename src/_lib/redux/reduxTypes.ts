import { EntityState } from "@reduxjs/toolkit";
import { Channel, ChannelInvite, FriendRequest, Person, UserInfo } from "../responseTypes";

export interface UserInfoSlice extends Omit<UserInfo, "friends" | "channels" | "friendRequests" | "channelInvites">{
    friends: EntityState<Person, string>,
    channels: EntityState<Channel, string>,
    friendRequests: EntityState<FriendRequest, string>,
    channelInvites: EntityState<ChannelInvite, string>
}