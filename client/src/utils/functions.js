export function getDatesBetween(startDate, endDate) {
    let dateArray = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
        dateArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
}

export function normalizeDate(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

export function convertUTCtoIST(utcDateString) {
    const utcDate = new Date(utcDateString);
    const ISTOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(utcDate.getTime() + ISTOffset);
    return istDate;
}

export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
        return true; 
    } else {
        return false; 
    }
}

