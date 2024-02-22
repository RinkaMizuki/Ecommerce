import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    login: {
      currentUser: null,
      isFetching: false,
      erorr: false,
      message: "",
    }
  },
  reducers: {
    loginStart: (state) => {
      state.login.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.login.isFetching = false;
      const { accessToken, ...newObj } = action.payload;
      state.login.currentUser = newObj;
      state.login.erorr = false;
      state.login.message = action.payload.message;
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
      state.login.message = action.payload.message;
    },
    logoutFailed: (state, action) => {
      state.login.isFetching = false;
      state.login.erorr = true;
      state.login.message = action.payload.message;
    }
  }
})

export const {
  loginStart,
  loginFailed,
  loginSuccess,
  logoutStart,
  logoutFailed,
  logoutSuccess
} = authSlice.actions

export default authSlice.reducer