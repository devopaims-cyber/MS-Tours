import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from '@/api/auth';
import * as usersApi from '@/api/users';

export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const res = await authApi.loginUser(payload);
    localStorage.setItem('mst_token', res.token);
    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const res = await authApi.registerUser(payload);
    localStorage.setItem('mst_token', res.token);
    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    return await authApi.fetchMe();
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (payload, { rejectWithValue }) => {
  try {
    return await usersApi.updateProfile(payload);
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const slice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('mst_token') || null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('mst_token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => {
        s.status = 'loading';
        s.error = null;
      })
      .addCase(login.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.user = a.payload.user;
        s.token = a.payload.token;
      })
      .addCase(login.rejected, (s, a) => {
        s.status = 'failed';
        s.error = a.payload || a.error.message;
      })
      .addCase(register.pending, (s) => {
        s.status = 'loading';
        s.error = null;
      })
      .addCase(register.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.user = a.payload.user;
        s.token = a.payload.token;
      })
      .addCase(register.rejected, (s, a) => {
        s.status = 'failed';
        s.error = a.payload || a.error.message;
      })
      .addCase(fetchMe.fulfilled, (s, a) => {
        s.user = a.payload.user || a.payload;
      })
      .addCase(updateProfile.fulfilled, (s, a) => {
        s.user = a.payload.user || a.payload || s.user;
      });
  },
});

export const { logout, clearError } = slice.actions;
export default slice.reducer;

// Selectors
export const selectAuth = (s) => s.auth;
export const selectUser = (s) => s.auth.user;
export const selectIsAuthenticated = (s) => Boolean(s.auth.user && s.auth.token);
export const selectIsAdmin = (s) => s.auth.user?.role === 'admin';
