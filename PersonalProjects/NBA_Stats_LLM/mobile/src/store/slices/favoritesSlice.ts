import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Player {
  id: string;
  firstname: string;
  lastname: string;
  team?: {
    name: string;
  };
}

interface FavoritesState {
  favorites: Player[];
}

const initialState: FavoritesState = {
  favorites: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<Player>) => {
      const player = action.payload;
      const exists = state.favorites.some(fav => fav.id === player.id);
      if (!exists) {
        state.favorites.push(player);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(player => player.id !== action.payload);
    },
    clearFavorites: (state) => {
      state.favorites = [];
    },
  },
});

export const { addToFavorites, removeFromFavorites, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
