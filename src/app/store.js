import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import cityReducer from "../slices/cityslice";
import themeReducer from "../slices/themeslice";

const rootReducer = combineReducers({
  city: cityReducer,
  theme: themeReducer
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: {
    cityname: persistedReducer,
    theme: persistedReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
});
export const persistor = persistStore(store);