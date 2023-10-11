import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type InitialStateProps = {
    coaches: CoachProps[];
    selectedCoach: CoachProps | undefined;
    showCoachInformation: boolean;
};

const initialState: InitialStateProps = {
    coaches: [],
    selectedCoach: undefined,
    showCoachInformation: false
};

export const slice = createSlice({
    initialState,
    name: 'coaches',
    reducers: {
        setCoaches: (state, action: PayloadAction<CoachProps[]>) => {
            state.coaches = action.payload
        },
        createCoach: (state, action: PayloadAction<CoachProps>) => {
            state.coaches = [action.payload, ...state.coaches]
        },
        removeCoach: (state, action: PayloadAction<string>) => {
            state.coaches = state.coaches.filter((item) => item.id !== action.payload);
        },
        updateCoach: (state, action: PayloadAction<CoachProps>) => {
            state.coaches = state.coaches.map((item) => item.id === action.payload.id ? { ...action.payload } : item)
        },
        setSelectedCoach: (state, action: PayloadAction<CoachProps | undefined>) => {
            state.selectedCoach = action.payload
        },
        setShowCoachInformation: (state, action: PayloadAction<boolean>) => {
            state.showCoachInformation = action.payload
        },
    }
});

export const {
    setCoaches,
    updateCoach,
    createCoach,
    removeCoach,
    setSelectedCoach,
    setShowCoachInformation
} = slice.actions;

export default slice.reducer;
