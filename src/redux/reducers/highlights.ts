import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type InitialStateProps = {
    highlights: HighlightProps[];
    selectedHighlight: HighlightProps | undefined;
    showHighlightInformation: boolean;
    showTeamSelection: boolean;
    showAthleteSelection: boolean;
    selectedTeams: TeamHighlightProps[];
    selectedAthletes: PlayerHighlightProps[];
};

const initialState: InitialStateProps = {
    highlights: [],
    selectedHighlight: undefined,
    showHighlightInformation: false,
    showTeamSelection: false,
    showAthleteSelection: false,
    selectedTeams: [],
    selectedAthletes: []

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
        setShowTeamSelection: (state, action: PayloadAction<boolean>) => {
            state.showTeamSelection = action.payload
        },
        setShowAthleteSelection: (state, action: PayloadAction<boolean>) => {
            state.showAthleteSelection = action.payload
        },
        setSelectedTeams: (state, action: PayloadAction<TeamHighlightProps[]>) => {
            state.selectedTeams = action.payload
        },
        setSelectedAthletes: (state, action: PayloadAction<PlayerHighlightProps[]>) => {
            state.selectedAthletes = action.payload
        }
    }
});

export const {
    createHighlights,
    removeHighlights,
    setHighlights,
    setSelectedHighlights,
    setShowHighlightInformation,
    updateHighlights,
    setShowTeamSelection,
    setSelectedTeams,
    setSelectedAthletes,
    setShowAthleteSelection
} = slice.actions;

export default slice.reducer;
