import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type InitialStateProps = {
    players: PlayerProps[];
    selectedPlayer: PlayerProps | undefined;
    showPlayerInformation: boolean;
    achievements: AchievementProps[];
    showPlayerAchievements: boolean;
    files: FileProps[];
    showPlayerFiles: boolean;
};

const initialState: InitialStateProps = {
    files: [],
    players: [],
    achievements: [],
    showPlayerFiles: false,
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
        setFiles: (state, action: PayloadAction<FileProps[]>) => {
            state.files = action.payload
        },
        createFile: (state, action: PayloadAction<FileProps>) => {
            state.files = [action.payload, ...state.files]
        },
        removeFile: (state, action: PayloadAction<string>) => {
            state.files = state.files.filter((item) => item.id !== action.payload);
        },
        updateFile: (state, action: PayloadAction<FileProps>) => {
            state.files = state.files.map((item) => item.id === action.payload.id ? { ...action.payload } : item)
        },
        setShowPlayerAchievements: (state, action: PayloadAction<boolean>) => {
            state.showPlayerAchievements = action.payload
        },
        setShowPlayerFiles: (state, action: PayloadAction<boolean>) => {
            state.showPlayerFiles = action.payload
        }
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
    setShowPlayerAchievements,
    createFile,
    removeFile,
    updateFile,
    setShowPlayerFiles,
    setFiles
} = slice.actions;

export default slice.reducer;
