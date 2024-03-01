import {createSlice} from '@reduxjs/toolkit';

export type userState = {
  loggedIn: boolean;
  showTourScreen:boolean;
  userData: undefined | object;
};

let initialState : userState = {
  loggedIn: false,
  showTourScreen:true,
  userData: undefined,
};

export const userSlice = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.loggedIn = true;
      state.showTourScreen=false,
      state.userData = action.payload;
    },
    logoutSuccess: (state, action) => {
      state.loggedIn = false;
      state.userData = undefined;
    },
  },
});

export const {loginSuccess, logoutSuccess} = userSlice.actions;
