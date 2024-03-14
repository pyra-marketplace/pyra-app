import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Middleware } from "redux";
import {
  persistStore,
  persistReducer,
  PersistConfig,
  createMigrate,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import { creatorSlice } from "./createor/slice";
import { globalSlice, GlobalStates } from "./global/slice";
import { homeSlice } from "./home/slice";

const globalPersistConfig: PersistConfig<GlobalStates> = {
  key: "global",
  storage,
  whitelist: [],
};

const rootReducer = combineReducers({
  global: persistReducer(globalPersistConfig, globalSlice.reducer),
  creator: creatorSlice.reducer,
  home: homeSlice.reducer,
});

// 使用persistReducer强化reducer,persistReducer(config, reducer)
// const persistedReducer = persistReducer(persistConfig, rootReducer);

const middlewares: Array<Middleware> = [];

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(middlewares),
});

const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default { store, persistor };
