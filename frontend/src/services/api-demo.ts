// // Demo file to test API service
// import { courseApi } from './api'

// // Demo function to test all API endpoints
// export const runApiDemo = async () => {
//   console.log('🚀 Starting API Demo...')

//   try {
//     // Test 1: Get all courses
//     console.log('\n📚 Test 1: Get all courses')
//     const coursesResponse = await courseApi.getCourses(1, 5)
//     console.log('✅ Courses loaded:', coursesResponse.data?.length, 'courses')
//     console.log('Pagination:', coursesResponse.pagination)

//     // Test 2: Get course by slug
//     console.log('\n🔍 Test 2: Get course by slug')
//     const courseResponse = await courseApi.getCourseBySlug('goal-setting-masterclass-achieve-your-dreams')
//     console.log('✅ Course found:', courseResponse.data?.title)

//     // Test 3: Search courses
//     console.log('\n🔎 Test 3: Search courses')
//     const searchResponse = await courseApi.searchCourses('react', { level: 'Intermediate' })
//     console.log('✅ Search results:', searchResponse.data?.length, 'courses found')

//     // Test 4: Get enrolled courses
//     console.log('\n📖 Test 4: Get enrolled courses')
//     const enrolledResponse = await courseApi.getEnrolledCourses('user-123')
//     console.log('✅ Enrolled courses:', enrolledResponse.data?.length, 'courses')

//     // Test 5: Complete a lesson
//     console.log('\n✅ Test 5: Complete a lesson')
//     if (courseResponse.data) {
//       const completeResponse = await courseApi.completeLesson(courseResponse.data.id, 'lesson-1')
//       console.log('✅ Lesson completed, new progress:', completeResponse.data?.progress + '%')
//     }

//     // Test 6: Set current lesson
//     console.log('\n🎯 Test 6: Set current lesson')
//     if (courseResponse.data) {
//       const setLessonResponse = await courseApi.setCurrentLesson(courseResponse.data.id, 'lesson-2')
//       console.log('✅ Current lesson updated')
//     }

//     // Test 7: Update course progress
//     console.log('\n📊 Test 7: Update course progress')
//     if (courseResponse.data) {
//       const progressResponse = await courseApi.updateCourseProgress(courseResponse.data.id, 75)
//       console.log('✅ Progress updated to:', progressResponse.data?.progress + '%')
//     }

//     // Test 8: Enroll in course
//     console.log('\n🎓 Test 8: Enroll in course')
//     const enrollResponse = await courseApi.enrollInCourse('3', 'user-123')
//     console.log('✅ Enrolled in course:', enrollResponse.data?.title)

//     console.log('\n🎉 API Demo completed successfully!')

//   } catch (error) {
//     console.error('❌ API Demo failed:', error)
//   }
// }

// // Test error handling
// export const testErrorHandling = async () => {
//   console.log('\n🚨 Testing Error Handling...')

//   try {
//     // Test with invalid course slug
//     await courseApi.getCourseBySlug('invalid-course-slug')
//   } catch (error) {
//     console.log('✅ Error handling works:', error.message)
//   }

//   try {
//     // Test with invalid course ID
//     await courseApi.getCourseById('invalid-id')
//   } catch (error) {
//     console.log('✅ Error handling works:', error.message)
//   }
// }

// // Run demo if this file is executed directly
// if (typeof window !== 'undefined') {
//   // Add demo functions to window for easy testing in browser console
//   (window as any).runApiDemo = runApiDemo
//   (window as any).testErrorHandling = testErrorHandling
  
//   console.log('🔧 API Demo functions available:')
//   console.log('- runApiDemo() - Run full API demo')
//   console.log('- testErrorHandling() - Test error scenarios')
// }
