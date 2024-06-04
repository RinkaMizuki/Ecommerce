import { createSlice } from "@reduxjs/toolkit";

const cancelSlice = createSlice({
  name: "cancel",
  initialState: {
    isFetching: false,
    listCancel: [],
  },
  reducers: {
    saveUserCancel: (state, action) => {
      state.isFetching = action.payload;
    },
    listUserCancel: (state, action) => {
      state.listCancel = action.payload;
    },
  }
})

export const {
  saveUserCancel,
  listUserCancel,
} = cancelSlice.actions

export default cancelSlice.reducer