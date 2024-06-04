import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import addressSlice from "./addressSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import orderSlice from "./orderSlice";
import returnSlice from "./returnSlice";
import cancelSlice from "./cancelSlice";
import reviewSlice from "./reviewSlice";

const rootReducer = combineReducers({
  auth: authSlice,
  address: addressSlice,
  order: orderSlice,
  return: returnSlice,
  cancel: cancelSlice,
  review: reviewSlice
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