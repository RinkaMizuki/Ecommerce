import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "address",
  initialState: {
    isFetching: false,
    listAddress: [],
    idAddressSelected: "",
  },
  reducers: {
    saveUserAddress: (state, action) => {
      state.isFetching = action.payload;
    },
    listUserAddress: (state, action) => {
      state.listAddress = action.payload;
    },
  }
})

export const {
  saveUserAddress,
  listUserAddress,
} = orderSlice.actions

export default orderSlice.reducer