import { createSlice } from "@reduxjs/toolkit";

const returnSlice = createSlice({
  name: "return",
  initialState: {
    isFetching: false,
    listReturn: [],
  },
  reducers: {
    saveOrderReturn: (state, action) => {
      state.isFetching = action.payload;
    },
    listOrderReturn: (state, action) => {
      state.listReturn = action.payload;
    },
  },
});

export const { saveOrderReturn, listOrderReturn } = returnSlice.actions;

export default returnSlice.reducer;
