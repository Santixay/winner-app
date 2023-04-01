import React from "react";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import globalReducer from "state";
import userReducer from "slices/userSlice";
import { api } from "state/api";

const reducers = combineReducers({
  global: globalReducer,
  [api.reducerPath]: api.reducer,
  user: userReducer,
});

const store = configureStore({
  reducer: reducers,
  middleware: (getDefault) => getDefault().concat(api.middleware),
});
setupListeners(store.dispatch);

export default store;