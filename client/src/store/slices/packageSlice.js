import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '@/api/packages';

export const fetchPackages = createAsyncThunk('packages/fetch', async (params, { rejectWithValue }) => {
  try {
    return await api.listPackages(params);
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const fetchFeaturedPackages = createAsyncThunk('packages/featured', async (_, { rejectWithValue }) => {
  try {
    return await api.getFeaturedPackages();
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const searchPackages = createAsyncThunk('packages/search', async (params, { rejectWithValue }) => {
  try {
    return await api.searchPackages(params);
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const fetchPackageById = createAsyncThunk('packages/byId', async (id, { rejectWithValue }) => {
  try {
    return await api.getPackage(id);
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const slice = createSlice({
  name: 'packages',
  initialState: {
    list: [],
    featured: [],
    detail: null,
    status: 'idle',
    error: null,
    total: 0,
    page: 1,
  },
  reducers: {
    clearDetail: (s) => {
      s.detail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackages.pending, (s) => {
        s.status = 'loading';
      })
      .addCase(fetchPackages.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.list = a.payload.data || a.payload;
        s.total = a.payload.total || s.list.length;
        s.page = a.payload.page || 1;
      })
      .addCase(fetchPackages.rejected, (s, a) => {
        s.status = 'failed';
        s.error = a.payload || a.error.message;
      })
      .addCase(fetchFeaturedPackages.fulfilled, (s, a) => {
        s.featured = a.payload.data || a.payload || [];
      })
      .addCase(searchPackages.fulfilled, (s, a) => {
        s.list = a.payload.data || a.payload;
        s.total = a.payload.total || s.list.length;
      })
      .addCase(fetchPackageById.fulfilled, (s, a) => {
        s.detail = a.payload;
      });
  },
});

export const { clearDetail } = slice.actions;
export default slice.reducer;
