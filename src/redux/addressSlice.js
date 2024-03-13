import { createSlice } from "@reduxjs/toolkit";

const addressSlice = createSlice({
  name: "address",
  initialState: {
    isFetching: false,
    listAddress: [],
  },
  reducers: {
    saveUserAddress: (state, action) => {
      state.isFetching = action.payload;
    },
    listUserAddress: (state, action) => {
      state.listAddress = action.payload;
    }
  }
})

export const {
  saveUserAddress,
  listUserAddress
} = addressSlice.actions

export default addressSlice.reducer