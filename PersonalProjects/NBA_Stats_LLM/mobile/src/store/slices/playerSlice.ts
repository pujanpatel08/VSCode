import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { nbaAPI } from '../../services/nbaAPI';

interface Player {
  id: string;
  firstname: string;
  lastname: string;
  team?: {
    name: string;
  };
}

interface PlayerStats {
  points?: number;
  totReb?: number;
  assists?: number;
  fgp?: number;
  tpp?: number;
  ftp?: number;
  games?: Array<{
    points: number;
    totReb: number;
    assists: number;
  }>;
}

interface PlayerState {
  players: Player[];
  playerStats: Record<string, PlayerStats>;
  loading: boolean;
  error: string | null;
}

const initialState: PlayerState = {
  players: [],
  playerStats: {},
  loading: false,
  error: null,
};

export const searchPlayers = createAsyncThunk(
  'players/searchPlayers',
  async (query: string) => {
    const response = await nbaAPI.searchPlayers(query);
    return response;
  }
);

export const getPlayerStats = createAsyncThunk(
  'players/getPlayerStats',
  async ({ playerId, season, type }: { playerId: string; season: string; type: 'regular' | 'playoffs' }) => {
    const response = await nbaAPI.getPlayerStats(playerId, season, type);
    return { playerId, stats: response };
  }
);

const playerSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    clearPlayers: (state) => {
      state.players = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchPlayers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPlayers.fulfilled, (state, action: PayloadAction<Player[]>) => {
        state.loading = false;
        state.players = action.payload;
      })
      .addCase(searchPlayers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search players';
      })
      .addCase(getPlayerStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlayerStats.fulfilled, (state, action) => {
        state.loading = false;
        state.playerStats[action.payload.playerId] = action.payload.stats;
      })
      .addCase(getPlayerStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get player stats';
      });
  },
});

export const { clearPlayers, clearError } = playerSlice.actions;
export default playerSlice.reducer;
