import { EntityState } from "@reduxjs/toolkit";
import { Channel, Friend, UserInfo } from "../responseTypes";

export interface UserInfoSlice extends Omit<UserInfo, "friends" | "channels">{
    friends: EntityState<Friend, string>,
    channels: EntityState<Channel, string> 
}