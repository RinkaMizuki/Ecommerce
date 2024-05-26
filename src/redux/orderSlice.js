import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    isFetching: false,
    listOrder: [],
  },
  reducers: {
    saveUserOrder: (state, action) => {
      state.isFetching = action.payload;
    },
    listUserOrder: (state, action) => {
      state.listOrder = action.payload;
    },
  }
})

export const {
  saveUserOrder,
  listUserOrder,
} = orderSlice.actions

export default orderSlice.reducer