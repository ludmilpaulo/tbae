import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface About {
  id: number;
  content: string;
}

interface AboutState {
  data: About | null;
  loading: boolean;
  error: string | null;
}

const initialState: AboutState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchAbout = createAsyncThunk("about/fetchAbout", async () => {
  const response = await axios.get("/api/about/");
  return response.data;
});

const aboutSlice = createSlice({
  name: "about",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAbout.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAbout.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAbout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching about data";
      });
  },
});

export default aboutSlice.reducer;
