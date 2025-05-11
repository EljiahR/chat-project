import { Message } from "./responseTypes";

export const messageSortByDateReverse = (a: Message, b: Message) => {
    return new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime();
}