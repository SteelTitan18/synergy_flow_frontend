import { createSlice } from "@reduxjs/toolkit";
import {
  getSessionUser,
  removeUserSession,
  setSessionUser,
} from "../../../functions/user/session";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    loggedIn: false,
    user: null,
    loading: true,
    error: null,
  },
  reducers: {
    checkLoginStatus: (state) => {
      state.loading = true;
      const user = sessionStorage.getItem("user");
      if (user) {
        state.loggedIn = true;
        state.user = getSessionUser();
        state.loading = false;
        state.error = null;
      } else {
        state.loggedIn = false;
        state.user = null;
        state.loading = false;
        state.error = null;
      }
    },
    loginStart: (state) => {
      state.loading = true;
      state.loggedIn = false;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loggedIn = true;
      state.user = action.payload;
      state.loading = false;
      state.error = null;
      setSessionUser({ user: action.payload });
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.loggedIn = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.loggedIn = false;
      state.user = null;
      state.loading = false;
      state.error = null;
      removeUserSession();
    },
  },
});

export const {
  checkLoginStatus,
  checkLogin,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} = userSlice.actions;

export default userSlice.reducer;
