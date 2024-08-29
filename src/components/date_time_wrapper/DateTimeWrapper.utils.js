import { isNaN } from '../../utils/jsUtility';

export function isValidDate(date) {
    const dateObject = new Date(date);
    return dateObject instanceof Date && !isNaN(dateObject.getTime());
}

export function convertDate(dateObject, enableTime) {
    const date = new Date(dateObject);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2); // Adding 1 because getMonth() returns zero-based month
    const day = (`0${date.getDate()}`).slice(-2);
    const hours = (`0${date.getHours()}`).slice(-2);
    const minutes = (`0${date.getMinutes()}`).slice(-2);
    const seconds = (`0${date.getSeconds()}`).slice(-2);
    return enableTime ? `${year}-${month}-${day}T${hours}:${minutes}:${seconds}` : `${year}-${month}-${day}`;
}
