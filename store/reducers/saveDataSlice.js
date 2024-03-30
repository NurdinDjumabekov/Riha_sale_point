import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
};

const saveDataSlice = createSlice({
  name: "saveDataSlice",
  initialState,
  reducers: {
    changeToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { changeToken } = saveDataSlice.actions;

export default saveDataSlice.reducer;
