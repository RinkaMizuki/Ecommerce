import { createSlice } from "@reduxjs/toolkit";

const returnSlice = createSlice({
  name: "return",
  initialState: {
    isFetching: false,
    listReturn: [],
  },
  reducers: {
    saveUserReturn: (state, action) => {
      state.isFetching = action.payload;
    },
    listUserReturn: (state, action) => {
      state.listReturn = action.payload;
    },
  }
})

export const {
  saveUserOrder,
  listUserReturn,
} = returnSlice.actions

export default returnSlice.reducer