import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type InitialStateProps = {
    players: PlayerProps[];
    selectedPlayer: PlayerProps | undefined;
    showPlayerInformation: boolean;
};

const initialState: InitialStateProps = {
    players: [],
    selectedPlayer: undefined,
    showPlayerInformation: false,
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
        }
    }
});

export const {
    setPlayers,
    updatePlayer,
    createPlayer,
    removePlayer,
    setSelectedPlayer,
    setShowPlayerInformation
} = slice.actions;

export default slice.reducer;
