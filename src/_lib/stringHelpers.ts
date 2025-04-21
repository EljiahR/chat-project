export const joinWithConjunction = (words: string[], conjunction: string = "and"): string => {
    if (!words || words.length == 0) {
        return "";
    } else if (words.length == 1) {
        return words[0];
    } else if (words.length == 2) {
        return words[0] + " " + conjunction + " " + words[1];
    }

    return words.slice(0, -2).join(", ") + words[-1];
}