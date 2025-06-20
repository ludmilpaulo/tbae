import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "./slices/eventsSlice";
import testimonialsReducer from "./slices/testimonialsSlice";
import galleryReducer from "./slices/gallerySlice";
import aboutReducer from "./slices/aboutSlice";
import homepageReducer from "./slices/homepageSlice";
import { venuesApi } from "./services/venuesApi"; // Adjust path as needed

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    testimonials: testimonialsReducer,
    gallery: galleryReducer,
    about: aboutReducer,
    homepage: homepageReducer,
    [venuesApi.reducerPath]: venuesApi.reducer, // Add your API slice reducer here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(venuesApi.middleware), // And the middleware here!
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
