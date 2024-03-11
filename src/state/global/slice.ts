import { Connector } from "@meteor-web3/connector";
import { ChainId, PyraZone } from "@pyra-marketplace/pyra-sdk";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GlobalStates {
  autoConnecting: boolean;
  chainId: ChainId;
}

const initialState: GlobalStates = {
  autoConnecting: true,
  chainId: ChainId.PolygonMumbai,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setAutoConnecting: (state, action: PayloadAction<boolean>) => {
      state.autoConnecting = action.payload;
    },
  },
});

export default globalSlice.reducer;
