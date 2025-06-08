import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Event } from "@/types";

interface EventsState {
  data: Event[];
  loading: boolean;
  error: string | null;
}
const initialState: EventsState = { data: [], loading: false, error: null };

export const fetchEvents = createAsyncThunk("events/fetchEvents", async () => {
  const { data } = await axios.get("http://localhost:8000/api/events/");
  return data;
});

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load events";
      });
  },
});

export default eventsSlice.reducer;
