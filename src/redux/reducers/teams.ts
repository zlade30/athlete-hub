import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type InitialStateProps = {
    teams: TeamProps[];
    selectedTeam: TeamProps | undefined;
    selectedPlayers: TeamPlayerProps[];
    showTeamInformation: boolean;
    showTeamPlayerSelection: boolean;
    achievements: AchievementProps[];
    showTeamAchievements: boolean;
};

const initialState: InitialStateProps = {
    teams: [],
    selectedTeam: undefined,
    selectedPlayers: [],
    showTeamInformation: false,
    showTeamPlayerSelection: false,
    achievements: [],
    showTeamAchievements: false
};

export const slice = createSlice({
    initialState,
    name: 'teams',
    reducers: {
        setTeams: (state, action: PayloadAction<TeamProps[]>) => {
            state.teams = action.payload
        },
        createTeam: (state, action: PayloadAction<TeamProps>) => {
            state.teams = [action.payload, ...state.teams]
        },
        removeTeam: (state, action: PayloadAction<string>) => {
            state.teams = state.teams.filter((item) => item.id !== action.payload);
        },
        updateTeam: (state, action: PayloadAction<TeamProps>) => {
            state.teams = state.teams.map((item) => item.id === action.payload.id ? { ...action.payload } : item)
        },
        setSelectedTeam: (state, action: PayloadAction<TeamProps | undefined>) => {
            state.selectedTeam = action.payload
        },
        setShowTeamPlayerSelection: (state, action: PayloadAction<boolean>) => {
            state.showTeamPlayerSelection = action.payload
        },
        setSelectedPlayers: (state, action: PayloadAction<TeamPlayerProps[]>) => {
            state.selectedPlayers = action.payload
        },
        setShowTeamInformation: (state, action: PayloadAction<boolean>) => {
            state.showTeamInformation = action.payload
        },
        createAchievement: (state, action: PayloadAction<AchievementProps>) => {
            state.achievements = [action.payload, ...state.achievements]
        },
        removeAchievement: (state, action: PayloadAction<string>) => {
            state.achievements = state.achievements.filter((item) => item.id !== action.payload);
        },
        updateAchievement: (state, action: PayloadAction<AchievementProps>) => {
            state.achievements = state.achievements.map((item) => item.id === action.payload.id ? { ...action.payload } : item)
        },
        setShowTeamAchievements: (state, action: PayloadAction<boolean>) => {
            state.showTeamAchievements = action.payload
        },
        setAchievements: (state, action: PayloadAction<AchievementProps[]>) => {
            state.achievements = action.payload
        }
    }
});

export const {
    setTeams,
    updateTeam,
    createTeam,
    removeTeam,
    setSelectedTeam,
    setSelectedPlayers,
    setShowTeamInformation,
    setShowTeamPlayerSelection,
    createAchievement,
    removeAchievement,
    setShowTeamAchievements,
    updateAchievement,
    setAchievements
} = slice.actions;

export default slice.reducer;
