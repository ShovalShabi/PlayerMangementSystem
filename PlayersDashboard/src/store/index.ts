import { configureStore, combineReducers } from "@reduxjs/toolkit";
import themeReducer from "./theme-reducer";
import filtersReducer from "./filters-reducer";
import measurementReducer from "./measurement-reducer";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

/**
 * Combined reducer that merges all application reducers.
 */
const overallReducer = combineReducers({
  theme: themeReducer,
  filters: filtersReducer,
  measurement: measurementReducer,
});

/**
 * Configuration for Redux Persist.
 * Ensures Redux state is persisted across page reloads by saving to localStorage.
 */
const persistConfig = {
  key: "root", // The key for the root level of the state.
  storage, // Defines storage method (localStorage by default for web).
};

// Persisted Reducer
const persistedReducer = persistReducer(persistConfig, overallReducer);

/**
 * Configure the Redux store with persistence and middleware adjustments.
 *
 * Features:
 * - State persistence using redux-persist
 * - Customized middleware to handle redux-persist serialization
 * - Ignored action types to avoid serializability warnings
 */
const store = configureStore({
  reducer: persistedReducer, // Use persisted reducer for the store.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignoring redux-persist related actions to avoid serializability warnings
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

/**
 * Persistor for the store.
 * Manages saving and restoring Redux state from storage.
 */
export const persistor = persistStore(store);

export default store;
