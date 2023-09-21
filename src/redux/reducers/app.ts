import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type InitialStateProps = {
    currentInfo: InfoProps
    showSpinnerFallback: FallbackProps;
    showSpinnerDialog: SpinnerDialogProps;
};

const initialState: InitialStateProps = {
    currentInfo: 'barangay-info',
    showSpinnerFallback: { show: false, content: '' },
    showSpinnerDialog: { open: false, content: '' }
};

export const slice = createSlice({
    initialState,
    name: 'app',
    reducers: {
        setCurrentInfo: (state, action: PayloadAction<InfoProps>) => {
            state.currentInfo = action.payload
        },
        setShowSpinnerDialog: (state, action: PayloadAction<SpinnerDialogProps>) => {
            state.showSpinnerDialog = action.payload
        },
        setShowSpinnerFallback: (state, action: PayloadAction<FallbackProps>) => {
            state.showSpinnerFallback = action.payload
        }
    }
});

export const {
    setCurrentInfo,
    setShowSpinnerDialog,
    setShowSpinnerFallback
} = slice.actions;

export default slice.reducer;
