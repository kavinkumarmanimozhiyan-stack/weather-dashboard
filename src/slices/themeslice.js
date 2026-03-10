import { createSlice } from '@reduxjs/toolkit'

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: null
  },
  reducers: {
    changeTheme(state, action) {
      state.mode = action.payload
    }
  }
})
export const { changeTheme } = themeSlice.actions
export default themeSlice.reducer