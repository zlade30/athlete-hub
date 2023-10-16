import { db } from "@/firebase"
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore"

export const fbAddPlayer = async (payload: PlayerProps) => {
    try {
        delete payload.selected;
        const result = await addDoc(collection(db, 'players'), payload);
        return { ...payload, id: result.id }
    } catch (error) {
        throw new Error(`An error occurred while adding the player: ${error}`);
    }
}

export const fbGetPlayers = async () => {
    try {
        const result = await getDocs(collection(db, 'players'));
        const resultDocs = result.docs.map((item) => ({ id: item.id, ...item.data() as PlayerProps }));
        const players = resultDocs.sort((a, b) => b.dateAdded! - a.dateAdded!);
        return players;
    } catch (error) {
        throw new Error(`An error occurred while fetching the list of players: ${error}`);
    }
}

export const fbDeletePlayer = async (id: string) => {
    try {
        await deleteDoc(doc(db, 'players', id));
        return 'Player deleted successfully.';
    } catch (error) {
        throw new Error(`An error occurred while deleting a player: ${error}`);
    }
}

export const fbUpdatePlayer = async (player: PlayerProps) => {
    try {
        delete player.selected;
        await updateDoc(doc(db, 'players', player.id!), { ...player })
        return player as PlayerProps;
    } catch (error) {
        throw new Error(`An error occurred while updating a player: ${error}`);
    }
}

export const fbAddPlayerAchievement = async (playerId: string, payload: AchievementProps) => {
    try {
        const result = await addDoc(collection(db, 'players', playerId, 'achievements'), payload);
        return { ...payload, id: result.id }
    } catch (error) {
        throw new Error(`An error occurred while adding an achievement: ${error}`);
    }
}

export const fbGetPlayersAchievements = async (playerId: string) => {
    try {
        const result = await getDocs(collection(db, 'players', playerId, 'achievements'));
        const resultDocs = result.docs.map((item) => ({ id: item.id, ...item.data() as AchievementProps }));
        const players = resultDocs.sort((a, b) => b.dateAdded! - a.dateAdded!);
        return players;
    } catch (error) {
        throw new Error(`An error occurred while fetching the list of achievements: ${error}`);
    }
}

export const fbDeletePlayerAchievement = async (playerId: string, achievementId: string) => {
    try {
        await deleteDoc(doc(db, 'players', playerId, 'achievements', achievementId));
        return 'Achievement deleted successfully.';
    } catch (error) {
        throw new Error(`An error occurred while deleting an achievement: ${error}`);
    }
}