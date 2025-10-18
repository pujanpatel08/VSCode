import { configureStore } from '@reduxjs/toolkit';
import playerSlice from './slices/playerSlice';
import favoritesSlice from './slices/favoritesSlice';
import aiSlice from './slices/aiSlice';

export const store = configureStore({
  reducer: {
    players: playerSlice,
    favorites: favoritesSlice,
    ai: aiSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
