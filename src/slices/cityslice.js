import { createSlice } from '@reduxjs/toolkit'

const citySlice = createSlice({
  name: 'cityname',
  initialState: [],
  reducers: {
    Addcity(state, action) {
      // console.log("state:", state)
      state.push(action.payload)
    },
    Deletecity(state, action) {
      return state.filter((_, index) => index !== action?.payload)
    },
  }
})
export const { Addcity, Deletecity } = citySlice?.actions
export default citySlice?.reducer