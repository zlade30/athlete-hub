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