import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '@/api/hotels';

export const fetchHotels = createAsyncThunk('hotels/fetch', async (params, { rejectWithValue }) => {
  try {
    return await api.listHotels(params);
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const searchHotels = createAsyncThunk('hotels/search', async (params, { rejectWithValue }) => {
  try {
    return await api.searchHotels(params);
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const fetchHotelById = createAsyncThunk('hotels/byId', async (id, { rejectWithValue }) => {
  try {
    return await api.getHotel(id);
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const slice = createSlice({
  name: 'hotels',
  initialState: { list: [], detail: null, status: 'idle', error: null, total: 0 },
  reducers: { clearDetail: (s) => { s.detail = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.pending, (s) => { s.status = 'loading'; })
      .addCase(fetchHotels.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.list = a.payload.data || a.payload;
        s.total = a.payload.total || s.list.length;
      })
      .addCase(fetchHotels.rejected, (s, a) => {
        s.status = 'failed';
        s.error = a.payload || a.error.message;
      })
      .addCase(searchHotels.fulfilled, (s, a) => {
        s.list = a.payload.data || a.payload;
        s.total = a.payload.total || s.list.length;
      })
      .addCase(fetchHotelById.fulfilled, (s, a) => {
        s.detail = a.payload;
      });
  },
});

export const { clearDetail } = slice.actions;
export default slice.reducer;
