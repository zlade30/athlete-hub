import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type InitialStateProps = {
    sports: SportProps[];
    selectedSport: SportProps | undefined;
    showSportInformation: boolean;
};

const initialState: InitialStateProps = {
    sports: [],
    selectedSport: undefined,
    showSportInformation: false
};

export const slice = createSlice({
    initialState,
    name: 'sports',
    reducers: {
        setSports: (state, action: PayloadAction<SportProps[]>) => {
            state.sports = action.payload
        },
        createSport: (state, action: PayloadAction<SportProps>) => {
            state.sports = [action.payload, ...state.sports]
        },
        removeSport: (state, action: PayloadAction<string>) => {
            state.sports = state.sports.filter((item) => item.id !== action.payload);
        },
        updateSport: (state, action: PayloadAction<SportProps>) => {
            state.sports = state.sports.map((item) => item.id === action.payload.id ? { ...action.payload } : item)
        },
        setSelectedSport: (state, action: PayloadAction<SportProps | undefined>) => {
            state.selectedSport = action.payload
        },
        setShowSportInformation: (state, action: PayloadAction<boolean>) => {
            state.showSportInformation = action.payload
        }
    }
});

export const {
    setSports,
    createSport,
    removeSport,
    updateSport,
    setSelectedSport,
    setShowSportInformation
} = slice.actions;

export default slice.reducer;
