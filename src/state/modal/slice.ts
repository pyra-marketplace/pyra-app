import { createSlice } from "@reduxjs/toolkit";

export interface ModalStates {
  shareModalVisible: boolean;
  keyModalVisible: boolean;
  keyModalCurrentTier: number;
}

const initialState: ModalStates = {
  shareModalVisible: false,
  keyModalVisible: false,
  keyModalCurrentTier: 0,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setShareModalVisible: (state, action) => {
      state.shareModalVisible = action.payload;
    },
    setKeyModalVisible: (state, action) => {
      state.keyModalVisible = action.payload;
    },
    setKeyModalCurrentTier: (state, action) => {
      state.keyModalCurrentTier = action.payload;
    },
  },
});

export default modalSlice.reducer;
