import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Homepage {
  id: number;
  bannerTitle: string;
  bannerImage: string;
}

interface HomepageState {
  data: Homepage | null;
  loading: boolean;
  error: string | null;
}

const initialState: HomepageState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchHomepage = createAsyncThunk("homepage/fetchHomepage", async () => {
  const response = await axios.get("/api/homepage/");
  return response.data;
});

const homepageSlice = createSlice({
  name: "homepage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomepage.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHomepage.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchHomepage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching homepage data";
      });
  },
});

export default homepageSlice.reducer;
