import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { appReducer, barangayReducer, coachesReducer, playerReducer } from './reducers';

export const store = configureStore({
    reducer: {
        app: appReducer,
        player: playerReducer,
        coaches: coachesReducer,
        barangay: barangayReducer
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
