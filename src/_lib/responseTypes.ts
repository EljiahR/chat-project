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

interface UserInfo
{
    userName: string,
    channels: Channel[]
}

export type {Message, UserInfo, Channel};