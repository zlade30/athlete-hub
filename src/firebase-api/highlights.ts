import { db } from "@/firebase"
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore"

export const fbAddHighlights = async (payload: HighlightProps) => {
    try {
        const result = await addDoc(collection(db, 'highlights'), payload);
        return { ...payload, id: result.id }
    } catch (error) {
        throw new Error(`An error occurred while adding a highlight: ${error}`);
    }
}

export const fbGetHighlights = async () => {
    try {
        const result = await getDocs(collection(db, 'highlights'));
        const resultDocs = result.docs.map((item) => ({ id: item.id, ...item.data() as HighlightProps }));
        const highlights = resultDocs.sort((a, b) => b.dateAdded! - a.dateAdded!);
        return highlights;
    } catch (error) {
        throw new Error(`An error occurred while fetching the list of highlights: ${error}`);
    }
}

export const fbDeleteHighlights = async (id: string) => {
    try {
        await deleteDoc(doc(db, 'highlights', id));
        return 'Highlight deleted successfully.';
    } catch (error) {
        throw new Error(`An error occurred while deleting a highlight: ${error}`);
    }
}

export const fbUpdateHighlight = async (highlight: HighlightProps) => {
    try {
        await updateDoc(doc(db, 'highlights', highlight.id!), { ...highlight })
        return highlight as HighlightProps;
    } catch (error) {
        throw new Error(`An error occurred while updating a highlights: ${error}`);
    }
}