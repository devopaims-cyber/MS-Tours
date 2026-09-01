import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '@/api/flights';

export const searchFlights = createAsyncThunk('flights/search', async (params, { rejectWithValue }) => {
  try {
    return await api.searchFlights(params);
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const fetchFlightById = createAsyncThunk('flights/byId', async (id, { rejectWithValue }) => {
  try {
    return await api.getFlight(id);
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const slice = createSlice({
  name: 'flights',
  initialState: { results: [], detail: null, status: 'idle', error: null, lastSearch: null },
  reducers: { clearDetail: (s) => { s.detail = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(searchFlights.pending, (s) => { s.status = 'loading'; })
      .addCase(searchFlights.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.results = a.payload.data || a.payload;
        s.lastSearch = a.meta?.arg || null;
      })
      .addCase(searchFlights.rejected, (s, a) => {
        s.status = 'failed';
        s.error = a.payload || a.error.message;
      })
      .addCase(fetchFlightById.fulfilled, (s, a) => {
        s.detail = a.payload;
      });
  },
});

export const { clearDetail } = slice.actions;
export default slice.reducer;
