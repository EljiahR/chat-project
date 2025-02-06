interface Message {
    id: number,
    username: string,
    content: string,
    sentAt: Date
}

interface UserInfo
{
    userName: string,
    channelIds: number[]
}

export type {Message, UserInfo};