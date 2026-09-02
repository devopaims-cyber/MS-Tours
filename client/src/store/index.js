import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import authReducer from './slices/authSlice';
import packageReducer from './slices/packageSlice';
import hotelReducer from './slices/hotelSlice';
import flightReducer from './slices/flightSlice';
import bookingReducer from './slices/bookingSlice';
import favoriteReducer from './slices/favoriteSlice';
import travelportReducer from './slices/travelportSlice';
import persistConfig from './persistConfig';

const rootReducer = combineReducers({
  auth: authReducer,
  packages: packageReducer,
  hotels: hotelReducer,
  flights: flightReducer,
  bookings: bookingReducer,
  favorites: favoriteReducer,
  travelport: travelportReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
