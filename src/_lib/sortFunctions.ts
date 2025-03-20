import { Message } from "./responseTypes";

export const messageSortByDateReverse = (a: Message, b: Message) => {
    return new Date(b.sentAt).getDate() - new Date(a.sentAt).getDate();
}