import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type InitialStateProps = {
    players: PlayerProps[];
    selectedPlayer: PlayerProps | undefined;
    showPlayerInformation: boolean;
    achievements: AchievementProps[];
    showPlayerAchievements: boolean;
};

const initialState: InitialStateProps = {
    players: [],
    achievements: [],
    selectedPlayer: undefined,
    showPlayerInformation: false,
    showPlayerAchievements: false
};

export const slice = createSlice({
    initialState,
    name: 'players',
    reducers: {
        setPlayers: (state, action: PayloadAction<PlayerProps[]>) => {
            state.players = action.payload
        },
        createPlayer: (state, action: PayloadAction<PlayerProps>) => {
            state.players = [action.payload, ...state.players]
        },
        removePlayer: (state, action: PayloadAction<string>) => {
            state.players = state.players.filter((item) => item.id !== action.payload);
        },
        updatePlayer: (state, action: PayloadAction<PlayerProps>) => {
            state.players = state.players.map((item) => item.id === action.payload.id ? { ...action.payload } : item)
        },
        setSelectedPlayer: (state, action: PayloadAction<PlayerProps | undefined>) => {
            state.selectedPlayer = action.payload
        },
        setShowPlayerInformation: (state, action: PayloadAction<boolean>) => {
            state.showPlayerInformation = action.payload
        },
        setAchievements: (state, action: PayloadAction<AchievementProps[]>) => {
            state.achievements = action.payload
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
        setShowPlayerAchievements: (state, action: PayloadAction<boolean>) => {
            state.showPlayerAchievements = action.payload
        },
    }
});

export const {
    setPlayers,
    updatePlayer,
    createPlayer,
    removePlayer,
    setSelectedPlayer,
    setShowPlayerInformation,
    setAchievements,
    createAchievement,
    removeAchievement,
    updateAchievement,
    setShowPlayerAchievements
} = slice.actions;

export default slice.reducer;
