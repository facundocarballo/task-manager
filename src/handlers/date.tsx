export const getStringDate = (date: Date|null): string => {
    if (date == null ) return "Doesn't have Date to End."
    const year = date.getFullYear()
    let month = checkCorrectDateString(`${date.getMonth() + 1}`);
    let day = checkCorrectDateString(`${date.getDate()}`);
    let hour = checkCorrectDateString(`${date.getHours()}`);
    let min = checkCorrectDateString(`${date.getMinutes()}`);
    
    return `${month}-${day}-${year} | ${hour}:${min}`;
}

const checkCorrectDateString = (str: string): string => {
    if (Number(str) < 10) {
        return `0${str}`
    }

    return str;
}