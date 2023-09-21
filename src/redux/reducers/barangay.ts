import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type InitialStateProps = {
    selectedBarangay: string;
    barangayList: BarangayProps[];
};

const initialState: InitialStateProps = {
    barangayList: [],
    selectedBarangay: 'All'
};

export const slice = createSlice({
    initialState,
    name: 'barangay',
    reducers: {
        setBarangayList: (state, action: PayloadAction<BarangayProps[]>) => {
            state.barangayList = action.payload
        },
        setSelectedBarangay: (state, action: PayloadAction<string>) => {
            state.selectedBarangay = action.payload
        },
    }
});

export const {
    setBarangayList,
    setSelectedBarangay
} = slice.actions;

export default slice.reducer;
