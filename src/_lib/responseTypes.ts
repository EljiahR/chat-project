interface Message {
    id: string,
    username: string,
    content: string,
    sentAt: string,
    channelId: string
}

interface Channel {
    id: string,
    name: string,
    owner: Person,
    admins: Person[],
    members: Person[],
    channelMessages: Message[]
}

interface Person {
    userName: string,
    userId: string,
    isFriend: boolean
}

interface Friend {
    userName: string,
    userId: string,
    id: string // This is purely for entity adapter to function
}

interface UserInfo
{
    id: string,
    userName: string,
    channels: Channel[]
    friends: Friend[]
}

export type {Message, UserInfo, Channel, Person, Friend};