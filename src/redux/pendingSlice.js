import { createSlice } from "@reduxjs/toolkit";

const pendingSlice = createSlice({
  name: "pending",
  initialState: {
    isFetching: false,
    listPending: [],
  },
  reducers: {
    saveUserPending: (state, action) => {
      state.isFetching = action.payload;
    },
    listOrderPending: (state, action) => {
      state.listPending = action.payload;
    },
  },
});

export const { saveUserPending, listOrderPending } = pendingSlice.actions;

export default pendingSlice.reducer;
