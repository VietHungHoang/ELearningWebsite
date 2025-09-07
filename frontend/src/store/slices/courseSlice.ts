import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface Lesson {
  id: number
  title: string
  description: string
  duration: number
  videoUrl?: string
  isCompleted: boolean
  order: number
}

interface Course {
  id: number
  title: string
  description: string
  instructor: {
    id: number
    name: string
    avatar?: string
  }
  thumbnail: string
  price: number
  rating: number
  totalStudents: number
  totalLessons: number
  duration: number
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  lessons: Lesson[]
  isEnrolled: boolean
  progress: number
}

interface CourseState {
  courses: Course[]
  currentCourse: Course | null
  isLoading: boolean
  error: string | null
  filters: {
    category: string
    level: string
    priceRange: string
  }
}

const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  isLoading: false,
  error: null,
  filters: {
    category: '',
    level: '',
    priceRange: '',
  },
}

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    fetchCoursesStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchCoursesSuccess: (state, action: PayloadAction<Course[]>) => {
      state.isLoading = false
      state.courses = action.payload
    },
    fetchCoursesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    setCurrentCourse: (state, action: PayloadAction<Course>) => {
      state.currentCourse = action.payload
    },
    updateCourseProgress: (state, action: PayloadAction<{ courseId: number; progress: number }>) => {
      const course = state.courses.find(c => c.id === action.payload.courseId)
      if (course) {
        course.progress = action.payload.progress
      }
      if (state.currentCourse?.id === action.payload.courseId) {
        state.currentCourse.progress = action.payload.progress
      }
    },
    setFilters: (state, action: PayloadAction<Partial<CourseState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        level: '',
        priceRange: '',
      }
    },
  },
})

export const {
  fetchCoursesStart,
  fetchCoursesSuccess,
  fetchCoursesFailure,
  setCurrentCourse,
  updateCourseProgress,
  setFilters,
  clearFilters,
} = courseSlice.actions

export default courseSlice.reducer
