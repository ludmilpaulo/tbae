import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "./slices/eventsSlice";
import testimonialsReducer from "./slices/testimonialsSlice";
import galleryReducer from "./slices/gallerySlice";
import aboutReducer from "./slices/aboutSlice";
import homepageReducer from "./slices/homepageSlice";
import { galleryApi } from './services/galleryApi';
import { venuesApi } from "./services/venuesApi";

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    testimonials: testimonialsReducer,
    gallery: galleryReducer,
    about: aboutReducer,
    homepage: homepageReducer,
    [galleryApi.reducerPath]: galleryApi.reducer,
    [venuesApi.reducerPath]: venuesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(galleryApi.middleware)
      .concat(venuesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
