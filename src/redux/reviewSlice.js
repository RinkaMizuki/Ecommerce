import { createSlice } from "@reduxjs/toolkit";

const reviewSlice = createSlice({
  name: "review",
  initialState: {
    isFetching: false,
    listReview: [],
  },
  reducers: {
    saveUserReview: (state, action) => {
      state.isFetching = action.payload;
    },
    listUserReview: (state, action) => {
      state.listReview = action.payload;
    },
  }
})

export const {
  saveUserReview,
  listUserReview,
} = reviewSlice.actions

export default reviewSlice.reducer