import { configureStore } from "@reduxjs/toolkit";
import streamReducer from "../features/webrtc/streamSlice";

export const store = configureStore({
  reducer: {
    stream: streamReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

