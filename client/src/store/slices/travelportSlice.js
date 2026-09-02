import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '@/api/travelport';

export const fetchTravelportStatus = createAsyncThunk(
  'travelport/status',
  async (_, { rejectWithValue }) => {
    try { return await api.getTravelportStatus(); } catch (e) { return rejectWithValue(e.message); }
  }
);

export const liveSearch = createAsyncThunk(
  'travelport/search',
  async (params, { rejectWithValue }) => {
    try { return await api.searchLive(params); } catch (e) { return rejectWithValue(e.message); }
  }
);

export const createPnrThunk = createAsyncThunk(
  'travelport/createPnr',
  async (payload, { rejectWithValue }) => {
    try { return await api.createPnr(payload); } catch (e) { return rejectWithValue(e.message); }
  }
);

export const retrievePnr = createAsyncThunk(
  'travelport/retrievePnr',
  async ({ locator, lastName }, { rejectWithValue }) => {
    try { return await api.getPnr(locator, { lastName }); } catch (e) { return rejectWithValue(e.message); }
  }
);

export const cancelPnrThunk = createAsyncThunk(
  'travelport/cancelPnr',
  async (locator, { rejectWithValue }) => {
    try { return await api.cancelPnr(locator); } catch (e) { return rejectWithValue(e.message); }
  }
);

const slice = createSlice({
  name: 'travelport',
  initialState: {
    status: { provider: 'travelport', mode: 'demo', env: 'cert', credsConfigured: false },
    offers: [],
    lastSearch: null,
    selectedOffer: null,
    pnr: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedOffer: (s, a) => { s.selectedOffer = a.payload; },
    clearPnr: (s) => { s.pnr = null; },
    clearOffers: (s) => { s.offers = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTravelportStatus.fulfilled, (s, a) => {
        s.status = a.payload?.data || a.payload || s.status;
      })
      .addCase(liveSearch.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(liveSearch.fulfilled, (s, a) => {
        s.loading = false;
        s.offers = a.payload?.data || a.payload?.offers || [];
        s.lastSearch = a.meta?.arg || null;
      })
      .addCase(liveSearch.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error.message; })
      .addCase(createPnrThunk.fulfilled, (s, a) => {
        s.pnr = a.payload?.data || a.payload;
      })
      .addCase(retrievePnr.fulfilled, (s, a) => {
        s.pnr = a.payload?.data || a.payload;
      });
  },
});

export const { setSelectedOffer, clearPnr, clearOffers } = slice.actions;
export default slice.reducer;
