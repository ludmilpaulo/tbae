import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { Testimonial } from "@/types";
// Use this in your slice state/async thunk, e.g.:
interface TestimonialsState {
  data: Testimonial[];
  loading: boolean;
  error: string | null;
}
const initialState: TestimonialsState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchTestimonials = createAsyncThunk(
  "testimonials/fetchTestimonials",
  async () => {
    const response = await axios.get("/api/testimonials/");
    return response.data;
  }
);

const testimonialsSlice = createSlice({
  name: "testimonials",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonials.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching testimonials";
      });
  },
});

export default testimonialsSlice.reducer;
