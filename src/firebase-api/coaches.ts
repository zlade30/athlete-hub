import { db } from "@/firebase"
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore"

export const fbAddCoach = async (payload: CoachProps) => {
    try {
        delete payload.selected;
        const result = await addDoc(collection(db, 'coaches'), payload);
        return { ...payload, id: result.id }
    } catch (error) {
        throw new Error(`An error occurred while adding the coach: ${error}`);
    }
}

export const fbGetCoaches = async () => {
    try {
        const result = await getDocs(collection(db, 'coaches'));
        const resultDocs = result.docs.map((item) => ({ id: item.id, ...item.data() as CoachProps }));
        const coaches = resultDocs.sort((a, b) => b.dateAdded! - a.dateAdded!);
        return coaches;
    } catch (error) {
        throw new Error(`An error occurred while fetching the list of coaches: ${error}`);
    }
}

export const fbDeleteCoach = async (id: string) => {
    try {
        await deleteDoc(doc(db, 'coaches', id));
        return 'Coach deleted successfully.';
    } catch (error) {
        throw new Error(`An error occurred while deleting a coach: ${error}`);
    }
}

export const fbUpdateCoach = async (coach: CoachProps) => {
    try {
        delete coach.selected;
        await updateDoc(doc(db, 'coaches', coach.id!), { ...coach })
        return coach as CoachProps;
    } catch (error) {
        throw new Error(`An error occurred while updating a coach: ${error}`);
    }
}