import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '@/api/bookings';

export const createBooking = createAsyncThunk('bookings/create', async (payload, { rejectWithValue }) => {
  try {
    return await api.createBooking(payload);
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const fetchBookings = createAsyncThunk('bookings/list', async (_, { rejectWithValue }) => {
  try {
    return await api.listBookings();
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const fetchBookingById = createAsyncThunk('bookings/byId', async (id, { rejectWithValue }) => {
  try {
    return await api.getBooking(id);
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const cancelBooking = createAsyncThunk('bookings/cancel', async (id, { rejectWithValue }) => {
  try {
    return await api.cancelBooking(id);
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const slice = createSlice({
  name: 'bookings',
  initialState: {
    list: [],
    detail: null,
    status: 'idle',
    error: null,
    creating: false,
    lastCreated: null,
  },
  reducers: { clearDetail: (s) => { s.detail = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (s) => { s.status = 'loading'; })
      .addCase(fetchBookings.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.list = a.payload.data || a.payload;
      })
      .addCase(fetchBookings.rejected, (s, a) => {
        s.status = 'failed';
        s.error = a.payload || a.error.message;
      })
      .addCase(createBooking.pending, (s) => { s.creating = true; })
      .addCase(createBooking.fulfilled, (s, a) => {
        s.creating = false;
        s.lastCreated = a.payload.data || a.payload;
      })
      .addCase(createBooking.rejected, (s, a) => {
        s.creating = false;
        s.error = a.payload || a.error.message;
      })
      .addCase(fetchBookingById.fulfilled, (s, a) => {
        s.detail = a.payload;
      })
      .addCase(cancelBooking.fulfilled, (s, a) => {
        const updated = a.payload.data || a.payload;
        s.list = s.list.map((b) => (b._id === updated._id ? updated : b));
        if (s.detail?._id === updated._id) s.detail = updated;
      });
  },
});

export const { clearDetail } = slice.actions;
export default slice.reducer;
