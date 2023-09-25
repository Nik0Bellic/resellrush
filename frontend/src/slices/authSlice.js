import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  authModalActive: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));

      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
      localStorage.setItem('expirationTime', expirationTime);
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.clear();
    },
    setAuthModalActive: (state, action) => {
      state.authModalActive = action.payload;
    },
  },
});

export const { setCredentials, logout, setAuthModalActive } = authSlice.actions;

export default authSlice.reducer;
