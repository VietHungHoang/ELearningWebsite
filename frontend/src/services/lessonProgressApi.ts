import api from './api'

export interface LessonProgressRequest {
  isCompleted: boolean
  isCurrent: boolean
  isLocked: boolean
}

export interface LessonProgressResponse {
  success: boolean
  message: string
  lessonId: string
  isCompleted: boolean
  isCurrent: boolean
  isLocked: boolean
}

export const lessonProgressApi = {
  // Update lesson progress
  updateLessonProgress: async (lessonId: string, data: LessonProgressRequest): Promise<LessonProgressResponse> => {
    try {
      console.log('DEBUG: lessonProgressApi - Updating lesson:', lessonId, 'with data:', data)
      const response = await api.put(`/lessons/${lessonId}/progress`, data)
      console.log('DEBUG: lessonProgressApi - Response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error updating lesson progress:', error)
      throw error
    }
  },

  // Get lesson progress
  getLessonProgress: async (lessonId: string): Promise<LessonProgressResponse> => {
    try {
      const response = await api.get(`/lessons/${lessonId}/progress`)
      return response.data
    } catch (error) {
      console.error('Error getting lesson progress:', error)
      throw error
    }
  }
}
