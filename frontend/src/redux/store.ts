import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "./slices/eventsSlice";
import testimonialsReducer from "./slices/testimonialsSlice";
import galleryReducer from "./slices/gallerySlice";

import homepageReducer from "./slices/homepageSlice";
import { galleryApi } from './services/galleryApi';
import { venuesApi } from "./services/venuesApi";
import { faqApi } from "./services/faqApi";
import { clientApi } from './services/clientApi';
import { aboutApi } from "./services/aboutApi";

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    testimonials: testimonialsReducer,
    gallery: galleryReducer,
    homepage: homepageReducer,
    [aboutApi.reducerPath]: aboutApi.reducer,
    [clientApi.reducerPath]: clientApi.reducer,
    [faqApi.reducerPath]: faqApi.reducer,
    [galleryApi.reducerPath]: galleryApi.reducer,
    [venuesApi.reducerPath]: venuesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(galleryApi.middleware)
      .concat(aboutApi.middleware)  
      .concat(clientApi.middleware)
      .concat(venuesApi.middleware)
      .concat(faqApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
