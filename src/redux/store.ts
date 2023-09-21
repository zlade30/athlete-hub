import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { appReducer, barangayReducer, playerReducer } from './reducers';

export const store = configureStore({
    reducer: {
        app: appReducer,
        player: playerReducer,
        barangay: barangayReducer
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
