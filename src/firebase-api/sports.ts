import { db } from "@/firebase"
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore"

export const fbAddSport = async (payload: SportProps) => {
    try {
        const result = await addDoc(collection(db, 'sports'), payload);
        return { ...payload, id: result.id }
    } catch (error) {
        throw new Error(`An error occurred while adding a sport: ${error}`);
    }
}

export const fbGetSports = async () => {
    try {
        const result = await getDocs(collection(db, 'sports'));
        const resultDocs = result.docs.map((item) => ({ id: item.id, ...item.data() as SportProps }));
        const sports = resultDocs.sort((a, b) => b.dateAdded! - a.dateAdded!);
        return sports;
    } catch (error) {
        throw new Error(`An error occurred while fetching the list of sports: ${error}`);
    }
}

export const fbDeleteSport = async (id: string) => {
    try {
        await deleteDoc(doc(db, 'sports', id));
        return 'Sport deleted successfully.';
    } catch (error) {
        throw new Error(`An error occurred while deleting a sport: ${error}`);
    }
}

export const fbUpdateSport = async (sport: SportProps) => {
    try {
        await updateDoc(doc(db, 'sports', sport.id!), { ...sport })
        return sport as SportProps;
    } catch (error) {
        throw new Error(`An error occurred while updating a sport: ${error}`);
    }
}