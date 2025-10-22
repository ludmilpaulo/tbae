import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { GalleryImage } from "@/types";
import { baseAPI } from "@/utils/configs";

interface GalleryState {
  data: GalleryImage[];
  loading: boolean;
  error: string | null;
}

const initialState: GalleryState = { data: [], loading: false, error: null };

export const fetchGallery = createAsyncThunk("gallery/fetchGallery", async () => {
  const { data } = await axios.get(`${baseAPI}/gallery/items/`);
  return data;
});

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load gallery";
      });
  },
});

export default gallerySlice.reducer;
