import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface UserProfile {
  id: number
  name: string
  email: string
  avatar?: string
  bio?: string
  phone?: string
  dateOfBirth?: string
  location?: string
  website?: string
  socialLinks?: {
    facebook?: string
    twitter?: string
    linkedin?: string
    github?: string
  }
  preferences: {
    language: string
    timezone: string
    notifications: {
      email: boolean
      push: boolean
      sms: boolean
    }
  }
  enrolledCourses: number[]
  completedCourses: number[]
  certificates: Array<{
    id: number
    courseId: number
    courseName: string
    issuedDate: string
    certificateUrl: string
  }>
}

interface UserState {
  profile: UserProfile | null
  isLoading: boolean
  error: string | null
  isUpdating: boolean
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
  isUpdating: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchProfileStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchProfileSuccess: (state, action: PayloadAction<UserProfile>) => {
      state.isLoading = false
      state.profile = action.payload
    },
    fetchProfileFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    updateProfileStart: (state) => {
      state.isUpdating = true
      state.error = null
    },
    updateProfileSuccess: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.isUpdating = false
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload }
      }
    },
    updateProfileFailure: (state, action: PayloadAction<string>) => {
      state.isUpdating = false
      state.error = action.payload
    },
    clearUserError: (state) => {
      state.error = null
    },
    addEnrolledCourse: (state, action: PayloadAction<number>) => {
      if (state.profile && !state.profile.enrolledCourses.includes(action.payload)) {
        state.profile.enrolledCourses.push(action.payload)
      }
    },
    addCompletedCourse: (state, action: PayloadAction<number>) => {
      if (state.profile && !state.profile.completedCourses.includes(action.payload)) {
        state.profile.completedCourses.push(action.payload)
      }
    },
  },
})

export const {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  clearUserError,
  addEnrolledCourse,
  addCompletedCourse,
} = userSlice.actions

export default userSlice.reducer
