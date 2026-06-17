import { configureStore } from '@reduxjs/toolkit'
import userSliceReducer from './userSlice.js'
export default configureStore({
    reducer: {
        user: userSliceReducer
    }
})