interface Message {
    id: number,
    username: string,
    content: string,
    sentAt: Date
}

interface UserInfo
{
    username: string
}

export type {Message, UserInfo};