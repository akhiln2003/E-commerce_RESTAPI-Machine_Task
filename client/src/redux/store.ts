import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./slices/userSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "./storage";
import { authApi } from "@/services/apis/AuthApis";
import { userApi } from "@/services/apis/UserApis";
import { adminApi } from "@/services/apis/AdminApis";

const rootReducer = combineReducers({
  userAuth: userReducer,
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [adminApi.reducerPath]: adminApi.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  blacklist: [authApi.reducerPath, userApi.reducerPath],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(authApi.middleware, userApi.middleware, adminApi.middleware),
  devTools: true,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
