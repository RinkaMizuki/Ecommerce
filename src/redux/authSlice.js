import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        login: {
            currentUser: null,
            isFetching: false,
            error: null,
            message: "",
            type: "",
        },
    },
    reducers: {
        loginStart: (state) => {
            state.login.isFetching = true;
            state.login.error = null;
            state.login.message = "";
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            const { type, user } = action.payload;
            state.login.currentUser = { user };
            state.login.error = null;
            state.login.message = action.payload.message;
            state.login.type = type;
        },
        loginFailed: (state, action) => {
            state.login.isFetching = false;
            state.login.error = action.payload;
            state.login.message = action.payload.message;
        },
        logoutStart: (state) => {
            state.login.isFetching = true;
            state.login.error = null;
            state.login.message = "";
        },
        logoutSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = null;
            state.login.error = null;
            state.login.message =
                action?.payload?.message || "Logout successfully.";
        },
        logoutFailed: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = null;
            state.login.error = action.payload;
            state.login.message = action.payload.message;
            state.login.type = "";
        },
        refreshFetching: (state) => {
            state.login.isFetching = false;
        },
        refreshError: (state) => {
            state.login.message = "";
            state.login.error = null;
        },
    },
});

export const {
    loginStart,
    loginFailed,
    loginSuccess,
    logoutStart,
    logoutFailed,
    logoutSuccess,
    refreshFetching,
    refreshError,
} = authSlice.actions;

export default authSlice.reducer;
