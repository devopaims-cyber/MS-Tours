import storage from 'redux-persist/lib/storage';

export default {
  key: 'mstours-root',
  version: 1,
  storage,
  // Only persist the auth slice — everything else is fetched fresh.
  whitelist: ['auth'],
};
