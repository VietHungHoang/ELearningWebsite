import apiService from './apiService';
import type { Course } from '../types/api';

const mockCourses: Course[] = [
  {
    id: 1,
    image: '/images/course1.jpg',
    title: 'Introduction to React',
    lessons: 10,
    students: 150,
    price: 49.99,
    duration: '5h 30m',
    review: 4.5,
  },
  {
    id: 2,
    image: '/images/course2.jpg',
    title: 'Advanced JavaScript',
    lessons: 15,
    students: 200,
    price: 79.99,
    duration: '8h 45m',
    review: 4.7,
  },
  {
    id: 3,
    image: '/images/course3.jpg',
    title: 'Python for Beginners',
    lessons: 12,
    students: 180,
    price: 59.99,
    duration: '6h 20m',
    review: 4.3,
  },
];

export const getCoursesByTutorId = async (tutorId: number): Promise<Course[]> => {
  try {
    const response = await apiService.get(`/courses/tutor/${tutorId}`);
    return response.data as Course[];
  } catch (error) {
    console.warn('Failed to fetch courses, using mock data:', error);
    return mockCourses;
  }
};