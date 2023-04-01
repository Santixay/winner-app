import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "Hello Redux toolkit",
  data: {},
  defaultStation: {},
};

export const userSlice = createSlice({
  name: "userStore",
  initialState: initialState,
  reducers: {
    setUserData: (state, action) => {
      state.data = action.payload;
    },
    setDefaultStation: (state, action) => {
      state.defaultStation = action.payload;
    },
    clear: (state) => {
        state.data = {};
        state.defaultStation = {};
      }
  },
});

export const {setUserData, setDefaultStation} = userSlice.actions;

export default userSlice.reducer;
