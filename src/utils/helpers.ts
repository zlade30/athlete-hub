export const generateId = (length: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
}

export const suffixData = () => {
    return [
        { id: generateId(10), value: '' },
        { id: generateId(10), value: 'Jr.' },
        { id: generateId(10), value: 'Sr.' }
    ]
}

export const genderData = () => {
    return [
        { id: generateId(10), value: '' },
        { id: generateId(10), value: 'Male' },
        { id: generateId(10), value: 'Female' }
    ]
}

export const defaultOptionData = () => {
    return [{ id: generateId(10), value: '' }]
}

export const printDate = () => {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMonth = String(month).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const formattedHoursStr = String(formattedHours).padStart(2, "0");
    const formattedMinutesStr = String(minutes).padStart(2, "0");
    const formattedDateString = `${formattedMonth}/${formattedDay}/${year} ${formattedHoursStr}:${formattedMinutesStr} ${ampm}`;
    return formattedDateString;
}

export const debounce = (func: Function, delay: number) => {
    let timer: any;
    return (...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

export const calculateAge = (birthdate: string) => {
    // Parse the birthdate string to a Date object
    const birthDate = new Date(birthdate);

    // Get the current date
    const currentDate = new Date();

    // Calculate the difference in years
    let age = currentDate.getFullYear() - birthDate.getFullYear();

    // Check if the birthday has occurred this year
    if (
        currentDate.getMonth() < birthDate.getMonth() ||
        (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())
    ) {
        // If not, subtract 1 from the age
        age--;
    }

    return age;
}