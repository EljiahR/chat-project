interface Message {
    id: number,
    username: string,
    content: string,
    sentAt: Date,
    channelId: number
}

interface Channel {
    id: number,
    name: string,
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
    userName: string,
    channels: Channel[]
    friends: Friend[]
}

export type {Message, UserInfo, Channel, Person, Friend};