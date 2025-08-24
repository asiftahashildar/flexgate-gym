import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import membersReducer from './slices/membersSlice';
import plansReducer from './slices/plansSlice';
import { combineReducers } from '@reduxjs/toolkit';

const persistConfig = {
  key: 'gym-registration',
  storage,
  whitelist: ['members', 'plans'], // Persist these slices
};

const rootReducer = combineReducers({
  members: membersReducer,
  plans: plansReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;