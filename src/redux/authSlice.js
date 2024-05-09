import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    login: {
      currentUser: null,
      isFetching: false,
      erorr: false,
      message: "",
      type: "",
    }
  },
  reducers: {
    loginStart: (state) => {
      state.login.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.login.isFetching = false;
      const { type, user } = action.payload;
      state.login.currentUser = { user };
      state.login.erorr = false;
      state.login.message = "Login successfully";
      state.login.type = type;
    },
    loginFailed: (state, action) => {
      state.login.isFetching = false;
      state.login.erorr = true;
      state.login.message = action.payload.message;
    },
    logoutStart: (state) => {
      state.login.isFetching = true;
      state.login.erorr = false;
    },
    logoutSuccess: (state, action) => {
      state.login.isFetching = false;
      state.login.currentUser = null;
      state.login.erorr = false;
      state.login.message = action?.payload?.message;
    },
    logoutFailed: (state, action) => {
      state.login.isFetching = false;
      state.login.erorr = true;
      state.login.message = "Logout failed";
      state.login.type = "";
    },
    refreshFetching: (state) => {
      state.login.isFetching = false;
    },
  }
})

export const {
  loginStart,
  loginFailed,
  loginSuccess,
  logoutStart,
  logoutFailed,
  logoutSuccess,
  refreshFetching
} = authSlice.actions

export default authSlice.reducer