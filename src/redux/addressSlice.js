import { createSlice } from "@reduxjs/toolkit";

const addressSlice = createSlice({
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
    chooseIdAddress: (state, action) => {
      state.idAddressSelected = action.payload;
    }
  }
})

export const {
  saveUserAddress,
  listUserAddress,
  chooseIdAddress
} = addressSlice.actions

export default addressSlice.reducer