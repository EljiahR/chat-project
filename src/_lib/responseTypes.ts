export interface Message {
    id: string,
    username: string,
    content: string,
    sentAt: string,
    channelId: string
}

export interface Channel {
    id: string,
    name: string,
    owner: Person,
    admins: Person[],
    members: Person[],
    channelMessages: Message[]
}

export interface Person {
    userName: string,
    id: string,
    isFriend: boolean
}

export enum FriendshipStatus {
    Friends,
    Pending,
    Blocked
}

export interface Friendship {
    id: string,
    initiatorId: string,
    receiverId: string,
    initiator: Person,
    receiver: Person,
    status: FriendshipStatus
}

export enum ChannelRole {
    Creator,
    Admin,
    Member
}

export enum UserStatus {
    Pending,
    Active,
    Banned
}

export interface ChannelUser {
    id: string,
    userId: string,
    user: Person,
    channelId: string,
    channel: Channel,
    role: ChannelRole,
    status: UserStatus
}

export interface UserInfo
{
    id: string,
    userName: string,
    channels: Channel[],
    friends: Person[],
    friendRequests: Friendship[],
    channelInvites: ChannelUser[]
}

export interface SignIn
{
    message: string,
    info: UserInfo
}

export interface ChatHistory {
    [channelId: string]: Message[];
}

export interface UsersTyping {
    [chanelId: string]: string[]
}
