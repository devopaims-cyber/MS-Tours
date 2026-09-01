import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '@/api/users';

export const fetchFavorites = createAsyncThunk('favorites/fetch', async (_, { rejectWithValue }) => {
  try {
    return await api.getFavorites();
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const addFavorite = createAsyncThunk('favorites/add', async (packageId, { rejectWithValue }) => {
  try {
    return await api.addFavorite(packageId);
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const removeFavorite = createAsyncThunk('favorites/remove', async (packageId, { rejectWithValue }) => {
  try {
    await api.removeFavorite(packageId);
    return packageId;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const slice = createSlice({
  name: 'favorites',
  initialState: { ids: [], items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.fulfilled, (s, a) => {
        const list = a.payload.data || a.payload || [];
        s.items = list;
        s.ids = list.map((p) => p._id);
      })
      .addCase(addFavorite.fulfilled, (s, a) => {
        const list = a.payload.data || a.payload || [];
        s.items = list;
        s.ids = list.map((p) => p._id);
      })
      .addCase(removeFavorite.fulfilled, (s, a) => {
        s.ids = s.ids.filter((id) => id !== a.payload);
        s.items = s.items.filter((p) => p._id !== a.payload);
      });
  },
});

export default slice.reducer;
