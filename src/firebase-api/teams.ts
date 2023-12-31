import { db } from "@/firebase"
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore"

export const fbAddTeam = async (payload: TeamProps) => {
    try {
        const team = {
            ...payload,
            players: payload.players.map((item) => ({
                id: item.id,
                lastName: item.lastName,
                firstName: item.firstName,
                profile: item.profile
            }))
        }
        delete team.selected;
        const result = await addDoc(collection(db, 'teams'), team);
        return { ...payload, id: result.id }
    } catch (error) {
        throw new Error(`An error occurred while adding the team: ${error}`);
    }
}

export const fbGetTeams = async () => {
    try {
        const result = await getDocs(collection(db, 'teams'));
        const resultDocs = result.docs.map((item) => ({ id: item.id, ...item.data() as TeamProps }));
        const teams = resultDocs.sort((a, b) => b.dateAdded! - a.dateAdded!);
        return teams;
    } catch (error) {
        throw new Error(`An error occurred while fetching the list of teams: ${error}`);
    }
}

export const fbDeleteTeam = async (id: string) => {
    try {
        await deleteDoc(doc(db, 'teams', id));
        return 'Team deleted successfully.';
    } catch (error) {
        throw new Error(`An error occurred while deleting a team: ${error}`);
    }
}

export const fbUpdateTeam = async (payload: TeamProps) => {
    try {
        const team = {
            ...payload,
            players: payload.players.map((item) => ({
                id: item.id,
                lastName: item.lastName,
                firstName: item.firstName,
                profile: item.profile
            }))
        }
        delete team.selected;
        await updateDoc(doc(db, 'teams', team.id!), { ...team })
        const updatedDocRef = doc(db, 'teams', team.id!);
        const updatedDocSnapshot = await getDoc(updatedDocRef);
        return updatedDocSnapshot.data() as TeamProps;
    } catch (error) {
        throw new Error(`An error occurred while updating a team: ${error}`);
    }
}

export const fbAddTeamAchievement = async (teamId: string, payload: AchievementProps) => {
    try {
        const result = await addDoc(collection(db, 'teams', teamId, 'achievements'), payload);
        return { ...payload, id: result.id }
    } catch (error) {
        throw new Error(`An error occurred while adding an achievement: ${error}`);
    }
}

export const fbGetTeamAchievements = async (teamId: string) => {
    try {
        const result = await getDocs(collection(db, 'teams', teamId, 'achievements'));
        const resultDocs = result.docs.map((item) => ({ id: item.id, ...item.data() as AchievementProps }));
        const teams = resultDocs.sort((a, b) => b.dateAdded! - a.dateAdded!);
        return teams;
    } catch (error) {
        throw new Error(`An error occurred while fetching the list of achievements: ${error}`);
    }
}

export const fbDeleteTeamAchievement = async (teamId: string, achievementId: string) => {
    try {
        await deleteDoc(doc(db, 'teams', teamId, 'achievements', achievementId));
        return 'Achievement deleted successfully.';
    } catch (error) {
        throw new Error(`An error occurred while deleting an achievement: ${error}`);
    }
}