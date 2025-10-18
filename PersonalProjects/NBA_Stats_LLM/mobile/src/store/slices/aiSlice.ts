import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { aiAPI } from '../../services/aiAPI';

interface AIState {
  response: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AIState = {
  response: null,
  loading: false,
  error: null,
};

export const processAIQuery = createAsyncThunk(
  'ai/processQuery',
  async (query: string) => {
    const response = await aiAPI.processQuery(query);
    return response;
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearResponse: (state) => {
      state.response = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(processAIQuery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processAIQuery.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.response = action.payload;
      })
      .addCase(processAIQuery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to process AI query';
      });
  },
});

export const { clearResponse, clearError } = aiSlice.actions;
export default aiSlice.reducer;
