import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice"
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const rootReducer = combineReducers({
  auth: authSlice
})

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth"],
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
})

export const persistor = persistStore(store);