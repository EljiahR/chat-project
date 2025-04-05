import { Message } from "./responseTypes";

export const messageSortByDateReverse = (a: Message, b: Message) => {
    return new Date(a.sentAt).getDate() - new Date(b.sentAt).getDate();
}