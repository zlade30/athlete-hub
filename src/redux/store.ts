import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { appReducer, barangayReducer, coachesReducer, highlightsReducer, playerReducer, sportsReducer, teamsReducer } from './reducers';

export const store = configureStore({
    reducer: {
        app: appReducer,
        teams: teamsReducer,
        sports: sportsReducer,
        player: playerReducer,
        coaches: coachesReducer,
        barangay: barangayReducer,
        highlights: highlightsReducer
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
