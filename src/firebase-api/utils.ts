import { db } from "@/firebase"
import { generateId } from "@/utils/helpers";
import { collection, getDocs } from "firebase/firestore"

export const getBarangay = async () => {
    try {
        const result = await getDocs(collection(db, 'barangay'));
        const resultDocs = result.docs.map((item) => ({ id: item.id, value: item.data().name }));
        const barangay = resultDocs.sort((a, b) => a.value.localeCompare(b.value));
        return [{ id: generateId(10), value: 'All' }, ...barangay];
    } catch (error) {
        throw new Error(`An error occurred while fetching the list of barangay: ${error}`);
    }
}

export const getSports = async () => {
    try {
        const result = await getDocs(collection(db, 'sports'));
        const resultDocs = result.docs.map((item) => ({ id: item.id, value: item.data().name }));
        const sports = resultDocs.sort((a, b) => a.value.localeCompare(b.value));
        return [{ id: generateId(10), value: 'All' }, ...sports];
    } catch (error) {
        throw new Error(`An error occurred while fetching the list of sports: ${error}`);
    }
}