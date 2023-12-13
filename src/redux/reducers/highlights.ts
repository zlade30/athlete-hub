import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type InitialStateProps = {
    highlights: HighlightProps[];
    selectedHighlight: HighlightProps | undefined;
    showHighlightInformation: boolean;
};

const initialState: InitialStateProps = {
    highlights: [],
    selectedHighlight: undefined,
    showHighlightInformation: false
};

export const slice = createSlice({
    initialState,
    name: 'highlights',
    reducers: {
        setHighlights: (state, action: PayloadAction<HighlightProps[]>) => {
            state.highlights = action.payload
        },
        createHighlights: (state, action: PayloadAction<HighlightProps>) => {
            state.highlights = [action.payload, ...state.highlights]
        },
        removeHighlights: (state, action: PayloadAction<string>) => {
            state.highlights = state.highlights.filter((item) => item.id !== action.payload);
        },
        updateHighlights: (state, action: PayloadAction<HighlightProps>) => {
            state.highlights = state.highlights.map((item) => item.id === action.payload.id ? { ...action.payload } : item)
        },
        setSelectedHighlights: (state, action: PayloadAction<HighlightProps | undefined>) => {
            state.selectedHighlight = action.payload
        },
        setShowHighlightInformation: (state, action: PayloadAction<boolean>) => {
            state.showHighlightInformation = action.payload
        },
    }
});

export const {
    createHighlights,
    removeHighlights,
    setHighlights,
    setSelectedHighlights,
    setShowHighlightInformation,
    updateHighlights
} = slice.actions;

export default slice.reducer;
