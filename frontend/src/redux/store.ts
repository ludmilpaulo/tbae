import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "./slices/eventsSlice";

import galleryReducer from "./slices/gallerySlice";

import homepageReducer from "./slices/homepageSlice";
import { galleryApi } from './services/galleryApi';
import { venuesApi } from "./services/venuesApi";
import { faqApi } from "./services/faqApi";
import { clientApi } from './services/clientApi';
import { aboutApi } from "./services/aboutApi";
import { contactApi } from "./services/contactApi";
import { testimonialsApi } from "./services/testimonialsApi";
import { activitiesApi } from "./services/activitiesApi";

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    
    gallery: galleryReducer,
    homepage: homepageReducer,
    [activitiesApi.reducerPath]: activitiesApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [testimonialsApi.reducerPath]: testimonialsApi.reducer,
    [aboutApi.reducerPath]: aboutApi.reducer,
    [clientApi.reducerPath]: clientApi.reducer,
    [faqApi.reducerPath]: faqApi.reducer,
    [galleryApi.reducerPath]: galleryApi.reducer,
    [venuesApi.reducerPath]: venuesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(contactApi.middleware)
      .concat(testimonialsApi.middleware)
      .concat(galleryApi.middleware)
      .concat(aboutApi.middleware)
      .concat(clientApi.middleware)
      .concat(venuesApi.middleware)
      .concat(activitiesApi.middleware)
      .concat(faqApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
