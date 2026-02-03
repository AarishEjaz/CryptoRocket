import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { encryptTransform } from "redux-persist-transform-encrypt";

import sideMenuSlice from "./slices/sideMenuSlice";
import authSlice from "./slices/authSlice";
import loadingSlice from './slices/loadingSlice'
import toggleThemeSlice from "./slices/toggleThemeSlice";
import withdrawalSlice from "./slices/withdrawalSlice"

// ✅ Persist config with encryption
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  transforms: [
    encryptTransform({
      secretKey: import.meta.env.REACT_APP_REDUX_SECRET || "superSecretKey123",
      onError: function (error) {
        console.error("Redux persist encryption error:", error);
      },
    }),
  ],
};

// ✅ Persisted root reducer
const rootReducer = {
  sideMenuSlice,
  isLoggedUser: persistReducer(persistConfig, authSlice),
  loading: loadingSlice,
  toggleThemeSlice,
  withdrawalSlice
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});

export const persistor = persistStore(store);
export default store;
