import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SelectedPhotosState {
  items: string[];
}

const initialState: SelectedPhotosState = {
  items: [],
};

const selectedPhotosSlice = createSlice({
  name: "selectedPhotos",
  initialState,
  reducers: {
    setSelected: (state, action: PayloadAction<string[]>) => {
      state.items = action.payload;
    },
    clearSelected: (state) => {
      state.items = [];
    },
  },
});

export const { setSelected, clearSelected } = selectedPhotosSlice.actions;
export default selectedPhotosSlice.reducer;
