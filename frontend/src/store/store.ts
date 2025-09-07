import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import courseReducer from './slices/courseSlice'
import userReducer from './slices/userSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    user: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
