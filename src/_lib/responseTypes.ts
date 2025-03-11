interface Message {
    id: number,
    username: string,
    content: string,
    sentAt: Date,
    channelId: number
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
    userId: string
}

interface UserInfo
{
    id: string,
    userName: string,
    channels: Channel[]
    friends: Friend[]
}

export type {Message, UserInfo, Channel, Person, Friend};