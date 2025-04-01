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
    userId: string,
    isFriend: boolean
}

export interface Friend {
    userName: string,
    userId: string,
    id: string // This is purely for entity adapter to function
}

export interface UserInfo
{
    id: string,
    userName: string,
    channels: Channel[]
    friends: Friend[]
}

export interface SignIn
{
    message: string,
    info: UserInfo
}
