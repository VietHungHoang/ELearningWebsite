// import type { Course } from '../types/course'

// // Sample course data
// export const sampleCourses: Record<string, Course> = {
//   'goal-setting-masterclass-achieve-your-dreams': {
//     id: '1',
//     title: 'Goal Setting Masterclass: Achieve Your Dreams',
//     slug: 'goal-setting-masterclass-achieve-your-dreams',
//     description: 'Learn the fundamentals of goal setting and achieve your dreams with this comprehensive masterclass. Master proven techniques used by successful people to set, track, and achieve their goals.',
//     shortDescription: 'Master the art of goal setting and turn your dreams into reality',
//     progress: 15,
//     thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=450&fit=crop',
//     videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
//     instructor: {
//       name: 'Steven Ford',
//       avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
//       title: 'Productivity Expert & Life Coach'
//     },
//     duration: '2h 30m',
//     level: 'Beginner',
//     rating: 4.8,
//     studentsCount: 12500,
//     price: 89,
//     originalPrice: 149,
//     isEnrolled: true,
//     lastAccessed: '2024-01-15',
//     completionPercentage: 15,
//     totalLessons: 8,
//     completedLessons: 1,
//     sections: [
//       {
//         id: 'section-1',
//         title: 'Understanding Goals and Why They Matter',
//         isExpanded: true,
//         progress: { completed: 1, total: 3, duration: '13 mins 5 sec' },
//         lessons: [
//           {
//             id: 'lesson-1',
//             title: 'The Importance of Goal Setting',
//             duration: '4 mins 30 sec',
//             isCompleted: true,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
//             description: 'Learn why goal setting is crucial for success and how it can transform your life.',
//             quiz: {
//               id: 'quiz-goal-setting',
//               title: 'Goal Setting Fundamentals Quiz',
//               description: 'Test your understanding of goal setting principles',
//               questions: [
//                 {
//                   id: 'q1',
//                   quizId: 'quiz-goal-setting',
//                   questionText: 'What is the most important characteristic of effective goals?',
//                   questionType: 'multiple_choice',
//                   points: 10,
//                   options: [
//                     { id: 'a', text: 'They should be easy to achieve', isCorrect: false, order: 1 },
//                     { id: 'b', text: 'They should be specific and measurable', isCorrect: true, order: 2 },
//                     { id: 'c', text: 'They should be vague and flexible', isCorrect: false, order: 3 },
//                     { id: 'd', text: 'They should be set by others', isCorrect: false, order: 4 }
//                   ],
//                   correctAnswer: 'b',
//                   explanation: 'Effective goals are specific, measurable, achievable, relevant, and time-bound (SMART).',
//                   order: 1
//                 },
//                 {
//                   id: 'q2',
//                   quizId: 'quiz-goal-setting',
//                   questionText: 'Goals should only focus on professional achievements.',
//                   questionType: 'true_false',
//                   points: 5,
//                   options: [
//                     { id: 'true', text: 'True', isCorrect: false, order: 1 },
//                     { id: 'false', text: 'False', isCorrect: true, order: 2 }
//                   ],
//                   correctAnswer: 'false',
//                   explanation: 'Goals should cover all areas of life including personal, professional, health, and relationships.',
//                   order: 2
//                 }
//               ],
//               passingScore: 70,
//               maxAttempts: 3,
//               timeLimit: 5,
//               isRequired: true,
//               isActive: true
//             }
//           },
//           {
//             id: 'lesson-2',
//             title: 'Types of Goals: Short-term vs Long-term',
//             duration: '4 mins 15 sec',
//             isCompleted: false,
//             isCurrent: true,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
//             description: 'Understand the difference between short-term and long-term goals and how to balance them.',
//             quiz: {
//               id: 'quiz-goal-types',
//               title: 'Goal Types Quiz',
//               description: 'Test your understanding of short-term vs long-term goals',
//               questions: [
//                 {
//                   id: 'q1',
//                   quizId: 'quiz-goal-types',
//                   questionText: 'Short-term goals typically span how long?',
//                   questionType: 'multiple_choice',
//                   points: 10,
//                   options: [
//                     { id: 'a', text: '1-3 months', isCorrect: true, order: 1 },
//                     { id: 'b', text: '1-2 years', isCorrect: false, order: 2 },
//                     { id: 'c', text: '5-10 years', isCorrect: false, order: 3 },
//                     { id: 'd', text: 'More than 10 years', isCorrect: false, order: 4 }
//                   ],
//                   correctAnswer: 'a',
//                   explanation: 'Short-term goals are typically achievable within 1-3 months.',
//                   order: 1
//                 },
//                 {
//                   id: 'q2',
//                   quizId: 'quiz-goal-types',
//                   questionText: 'Long-term goals should be broken down into short-term milestones.',
//                   questionType: 'true_false',
//                   points: 5,
//                   options: [
//                     { id: 'true', text: 'True', isCorrect: true, order: 1 },
//                     { id: 'false', text: 'False', isCorrect: false, order: 2 }
//                   ],
//                   correctAnswer: 'true',
//                   explanation: 'Breaking down long-term goals into short-term milestones makes them more manageable and achievable.',
//                   order: 2
//                 }
//               ],
//               passingScore: 70,
//               maxAttempts: 3,
//               timeLimit: 5,
//               isRequired: true,
//               isActive: true
//             }
//           },
//           {
//             id: 'lesson-3',
//             title: 'Creating a Vision Board',
//             duration: '4 mins 20 sec',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
//             description: 'Learn how to create an effective vision board to visualize your goals.'
//           }
//         ]
//       },
//       {
//         id: 'section-2',
//         title: 'Setting and Achieving Your Goals',
//         isExpanded: false,
//         progress: { completed: 0, total: 3, duration: '18 mins 30 sec' },
//         lessons: [
//           {
//             id: 'lesson-4',
//             title: 'SMART Goals Framework',
//             duration: '6 mins 15 sec',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
//             description: 'Learn the SMART framework for setting effective and achievable goals.'
//           },
//           {
//             id: 'lesson-5',
//             title: 'Breaking Down Big Goals',
//             duration: '6 mins 30 sec',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
//             description: 'Master the art of breaking down large goals into manageable steps.'
//           },
//           {
//             id: 'lesson-6',
//             title: 'Tracking Your Progress',
//             duration: '5 mins 45 sec',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
//             description: 'Learn effective methods to track and monitor your goal progress.'
//           }
//         ]
//       }
//     ]
//   },
//   'focus-and-concentration-boost-achieve-more': {
//     id: '2',
//     title: 'Focus and Concentration Boost: Achieve More',
//     slug: 'focus-and-concentration-boost-achieve-more',
//     description: 'Master the art of focus and concentration to boost your productivity and achieve more in less time.',
//     shortDescription: 'Boost your focus and concentration for maximum productivity',
//     progress: 0,
//     thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop',
//     videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
//     instructor: {
//       name: 'Steven Ford',
//       avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
//       title: 'Productivity Expert'
//     },
//     duration: '1h 45m',
//     level: 'Intermediate',
//     rating: 4.7,
//     studentsCount: 8900,
//     price: 79,
//     originalPrice: 129,
//     isEnrolled: true,
//     completionPercentage: 0,
//     totalLessons: 6,
//     completedLessons: 0,
//     sections: [
//       {
//         id: 'section-1',
//         title: 'Introduction to Focus and Concentration',
//         isExpanded: true,
//         progress: { completed: 0, total: 6, duration: '29 mins 45 sec' },
//         lessons: [
//           {
//             id: 'lesson-1',
//             title: 'What is Focus and Why It Matters',
//             duration: '4 mins',
//             isCompleted: false,
//             isCurrent: true,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
//             description: 'Understand the importance of focus in achieving your goals.',
//             quiz: {
//               id: 'focus-quiz-1',
//               title: 'Focus Fundamentals Quiz',
//               description: 'Test your understanding of focus and concentration basics',
//               questions: [
//                 {
//                   id: 'fq1',
//                   quizId: 'focus-quiz-1',
//                   questionText: 'What is the primary benefit of maintaining focus?',
//                   questionType: 'multiple_choice',
//                   points: 10,
//                   options: [
//                     { id: 'a', text: 'It reduces the need for breaks', isCorrect: false, order: 1 },
//                     { id: 'b', text: 'It increases productivity and quality of work', isCorrect: true, order: 2 },
//                     { id: 'c', text: 'It eliminates all distractions', isCorrect: false, order: 3 },
//                     { id: 'd', text: 'It makes tasks easier to complete', isCorrect: false, order: 4 }
//                   ],
//                   correctAnswer: 'b',
//                   explanation: 'Focus increases productivity and improves the quality of work by allowing deep concentration.',
//                   order: 1
//                 },
//                 {
//                   id: 'fq2',
//                   quizId: 'focus-quiz-1',
//                   questionText: 'Focus is a skill that can be developed and improved over time.',
//                   questionType: 'true_false',
//                   points: 5,
//                   options: [
//                     { id: 'true', text: 'True', isCorrect: true, order: 1 },
//                     { id: 'false', text: 'False', isCorrect: false, order: 2 }
//                   ],
//                   correctAnswer: 'true',
//                   explanation: 'Yes, focus is like a muscle that can be strengthened through practice and training.',
//                   order: 2
//                 }
//               ],
//               passingScore: 70,
//               maxAttempts: 3,
//               timeLimit: 5,
//               isRequired: true,
//               isActive: true
//             }
//           },
//           {
//             id: 'lesson-2',
//             title: 'Common Distractions and How to Overcome Them',
//             duration: '4 mins',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
//             description: 'Identify and eliminate common distractions that hinder your focus.',
//             quiz: {
//               id: 'focus-quiz-2',
//               title: 'Distractions Management Quiz',
//               description: 'Test your knowledge about managing distractions',
//               questions: [
//                 {
//                   id: 'fd1',
//                   quizId: 'focus-quiz-2',
//                   questionText: 'What is the most common source of distraction in modern work?',
//                   questionType: 'multiple_choice',
//                   points: 10,
//                   options: [
//                     { id: 'a', text: 'Noise from colleagues', isCorrect: false, order: 1 },
//                     { id: 'b', text: 'Digital notifications and social media', isCorrect: true, order: 2 },
//                     { id: 'c', text: 'Poor lighting', isCorrect: false, order: 3 },
//                     { id: 'd', text: 'Uncomfortable chairs', isCorrect: false, order: 4 }
//                   ],
//                   correctAnswer: 'b',
//                   explanation: 'Digital notifications and social media are the most common sources of distraction in modern work environments.',
//                   order: 1
//                 },
//                 {
//                   id: 'fd2',
//                   quizId: 'focus-quiz-2',
//                   questionText: 'Turning off notifications can significantly improve focus.',
//                   questionType: 'true_false',
//                   points: 5,
//                   options: [
//                     { id: 'true', text: 'True', isCorrect: true, order: 1 },
//                     { id: 'false', text: 'False', isCorrect: false, order: 2 }
//                   ],
//                   correctAnswer: 'true',
//                   explanation: 'Yes, turning off notifications eliminates interruptions and helps maintain deep focus.',
//                   order: 2
//                 }
//               ],
//               passingScore: 70,
//               maxAttempts: 3,
//               timeLimit: 5,
//               isRequired: true,
//               isActive: true
//             }
//           },
//           {
//             id: 'lesson-3',
//             title: 'The Pomodoro Technique',
//             duration: '5 mins',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
//             description: 'Master the Pomodoro Technique for enhanced productivity and focus.',
//             quiz: {
//               id: 'focus-quiz-3',
//               title: 'Pomodoro Technique Quiz',
//               description: 'Test your understanding of the Pomodoro Technique',
//               questions: [
//                 {
//                   id: 'fp1',
//                   quizId: 'focus-quiz-3',
//                   questionText: 'How long is a typical Pomodoro work session?',
//                   questionType: 'multiple_choice',
//                   points: 10,
//                   options: [
//                     { id: 'a', text: '15 minutes', isCorrect: false, order: 1 },
//                     { id: 'b', text: '25 minutes', isCorrect: true, order: 2 },
//                     { id: 'c', text: '45 minutes', isCorrect: false, order: 3 },
//                     { id: 'd', text: '60 minutes', isCorrect: false, order: 4 }
//                   ],
//                   correctAnswer: 'b',
//                   explanation: 'A typical Pomodoro work session is 25 minutes, followed by a 5-minute break.',
//                   order: 1
//                 },
//                 {
//                   id: 'fp2',
//                   quizId: 'focus-quiz-3',
//                   questionText: 'The Pomodoro Technique includes regular breaks between work sessions.',
//                   questionType: 'true_false',
//                   points: 5,
//                   options: [
//                     { id: 'true', text: 'True', isCorrect: true, order: 1 },
//                     { id: 'false', text: 'False', isCorrect: false, order: 2 }
//                   ],
//                   correctAnswer: 'true',
//                   explanation: 'Yes, the Pomodoro Technique includes short breaks (5 minutes) between work sessions and longer breaks (15-30 minutes) after every 4 Pomodoros.',
//                   order: 2
//                 }
//               ],
//               passingScore: 70,
//               maxAttempts: 3,
//               timeLimit: 5,
//               isRequired: true,
//               isActive: true
//             }
//           },
//           {
//             id: 'lesson-4',
//             title: 'Mindfulness and Meditation',
//             duration: '6 mins',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
//             description: 'Learn mindfulness techniques to improve your concentration abilities.'
//           },
//           {
//             id: 'lesson-5',
//             title: 'Creating a Focus-Friendly Environment',
//             duration: '4 mins 30 sec',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
//             description: 'Design your workspace and environment to maximize focus and productivity.'
//           },
//           {
//             id: 'lesson-6',
//             title: 'Building Focus Habits',
//             duration: '5 mins 15 sec',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
//             description: 'Develop sustainable habits that strengthen your focus over time.'
//           }
//         ]
//       }
//     ]
//   },
//   'time-management-mastery': {
//     id: '3',
//     title: 'Time Management Mastery: Get More Done',
//     slug: 'time-management-mastery',
//     description: 'Learn proven time management techniques to maximize your productivity and achieve your goals efficiently.',
//     shortDescription: 'Master time management for maximum productivity',
//     progress: 0,
//     thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop',
//     videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
//     instructor: {
//       name: 'Sarah Johnson',
//       avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
//       title: 'Time Management Specialist'
//     },
//     duration: '2h 15m',
//     level: 'Beginner',
//     rating: 4.9,
//     studentsCount: 15200,
//     price: 95,
//     originalPrice: 159,
//     isEnrolled: false,
//     completionPercentage: 0,
//     totalLessons: 10,
//     completedLessons: 0,
//     sections: [
//       {
//         id: 'section-1',
//         title: 'Fundamentals of Time Management',
//         isExpanded: true,
//         progress: { completed: 0, total: 7, duration: '32 mins 15 sec' },
//         lessons: [
//           {
//             id: 'lesson-1',
//             title: 'Understanding Time vs Energy',
//             duration: '4 mins',
//             isCompleted: false,
//             isCurrent: true,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
//             description: 'Learn the difference between time and energy management for better productivity.',
//             quiz: {
//               id: 'time-quiz-1',
//               title: 'Time vs Energy Management Quiz',
//               description: 'Test your understanding of time and energy management concepts',
//               questions: [
//                 {
//                   id: 'tq1',
//                   quizId: 'time-quiz-1',
//                   questionText: 'What is the main difference between time and energy management?',
//                   questionType: 'multiple_choice',
//                   points: 10,
//                   options: [
//                     { id: 'a', text: 'Time is finite, energy can be renewed', isCorrect: true, order: 1 },
//                     { id: 'b', text: 'Time is renewable, energy is finite', isCorrect: false, order: 2 },
//                     { id: 'c', text: 'There is no difference between them', isCorrect: false, order: 3 },
//                     { id: 'd', text: 'Time management is more important', isCorrect: false, order: 4 }
//                   ],
//                   correctAnswer: 'a',
//                   explanation: 'Time is finite and cannot be renewed, while energy can be restored through rest, nutrition, and exercise.',
//                   order: 1
//                 },
//                 {
//                   id: 'tq2',
//                   quizId: 'time-quiz-1',
//                   questionText: 'Energy management is more important than time management for productivity.',
//                   questionType: 'true_false',
//                   points: 5,
//                   options: [
//                     { id: 'true', text: 'True', isCorrect: true, order: 1 },
//                     { id: 'false', text: 'False', isCorrect: false, order: 2 }
//                   ],
//                   correctAnswer: 'true',
//                   explanation: 'While both are important, managing your energy levels is crucial for sustained productivity.',
//                   order: 2
//                 }
//               ],
//               passingScore: 70,
//               maxAttempts: 3,
//               timeLimit: 5,
//               isRequired: true,
//               isActive: true
//             }
//           },
//           {
//             id: 'lesson-2',
//             title: 'The Eisenhower Matrix',
//             duration: '4 mins',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
//             description: 'Master the Eisenhower Matrix for prioritizing tasks effectively.',
//             quiz: {
//               id: 'time-quiz-2',
//               title: 'Eisenhower Matrix Quiz',
//               description: 'Test your knowledge of the Eisenhower Matrix for task prioritization',
//               questions: [
//                 {
//                   id: 'te1',
//                   quizId: 'time-quiz-2',
//                   questionText: 'In the Eisenhower Matrix, which quadrant contains tasks that are urgent and important?',
//                   questionType: 'multiple_choice',
//                   points: 10,
//                   options: [
//                     { id: 'a', text: 'Quadrant 1: Do First', isCorrect: true, order: 1 },
//                     { id: 'b', text: 'Quadrant 2: Schedule', isCorrect: false, order: 2 },
//                     { id: 'c', text: 'Quadrant 3: Delegate', isCorrect: false, order: 3 },
//                     { id: 'd', text: 'Quadrant 4: Eliminate', isCorrect: false, order: 4 }
//                   ],
//                   correctAnswer: 'a',
//                   explanation: 'Quadrant 1 contains tasks that are both urgent and important - these should be done first.',
//                   order: 1
//                 },
//                 {
//                   id: 'te2',
//                   quizId: 'time-quiz-2',
//                   questionText: 'Tasks in Quadrant 2 (Important but not urgent) should be scheduled for later.',
//                   questionType: 'true_false',
//                   points: 5,
//                   options: [
//                     { id: 'true', text: 'True', isCorrect: true, order: 1 },
//                     { id: 'false', text: 'False', isCorrect: false, order: 2 }
//                   ],
//                   correctAnswer: 'true',
//                   explanation: 'Yes, Quadrant 2 tasks are important but not urgent, so they should be scheduled for later completion.',
//                   order: 2
//                 }
//               ],
//               passingScore: 70,
//               maxAttempts: 3,
//               timeLimit: 5,
//               isRequired: true,
//               isActive: true
//             }
//           },
//           {
//             id: 'lesson-3',
//             title: 'Time Blocking Techniques',
//             duration: '4 mins',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
//             description: 'Implement time blocking strategies to maximize your daily productivity.',
//             quiz: {
//               id: 'time-quiz-3',
//               title: 'Time Blocking Quiz',
//               description: 'Test your understanding of time blocking techniques',
//               questions: [
//                 {
//                   id: 'tb1',
//                   quizId: 'time-quiz-3',
//                   questionText: 'What is the main purpose of time blocking?',
//                   questionType: 'multiple_choice',
//                   points: 10,
//                   options: [
//                     { id: 'a', text: 'To work longer hours', isCorrect: false, order: 1 },
//                     { id: 'b', text: 'To schedule specific time slots for specific activities', isCorrect: true, order: 2 },
//                     { id: 'c', text: 'To avoid all meetings', isCorrect: false, order: 3 },
//                     { id: 'd', text: 'To eliminate breaks', isCorrect: false, order: 4 }
//                   ],
//                   correctAnswer: 'b',
//                   explanation: 'Time blocking involves scheduling specific time slots for specific activities to improve focus and productivity.',
//                   order: 1
//                 },
//                 {
//                   id: 'tb2',
//                   quizId: 'time-quiz-3',
//                   questionText: 'Time blocking helps reduce context switching between different tasks.',
//                   questionType: 'true_false',
//                   points: 5,
//                   options: [
//                     { id: 'true', text: 'True', isCorrect: true, order: 1 },
//                     { id: 'false', text: 'False', isCorrect: false, order: 2 }
//                   ],
//                   correctAnswer: 'true',
//                   explanation: 'Yes, time blocking reduces context switching by dedicating specific time blocks to similar tasks.',
//                   order: 2
//                 }
//               ],
//               passingScore: 70,
//               maxAttempts: 3,
//               timeLimit: 5,
//               isRequired: true,
//               isActive: true
//             }
//           },
//           {
//             id: 'lesson-4',
//             title: 'Eliminating Time Wasters',
//             duration: '5 mins',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
//             description: 'Identify and eliminate activities that waste your valuable time.'
//           },
//           {
//             id: 'lesson-5',
//             title: 'Delegation and Outsourcing',
//             duration: '6 mins',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
//             description: 'Learn when and how to delegate tasks to free up your time.'
//           },
//           {
//             id: 'lesson-6',
//             title: 'Digital Tools for Time Management',
//             duration: '5 mins 30 sec',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
//             description: 'Explore digital tools and apps that can enhance your time management.'
//           },
//           {
//             id: 'lesson-7',
//             title: 'Building Time Management Habits',
//             duration: '4 mins 45 sec',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
//             description: 'Develop sustainable habits that improve your time management skills.'
//           }
//         ]
//       }
//     ]
//   },
//   'react-development-mastery-zero-to-hero': {
//     id: '4',
//     title: 'React Development Mastery: From Zero to Hero',
//     slug: 'react-development-mastery-zero-to-hero',
//     description: 'Master React development from the ground up. Learn modern React patterns, hooks, state management, and build real-world applications.',
//     shortDescription: 'Complete React development course from beginner to advanced',
//     progress: 45,
//     thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
//     videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
//     instructor: {
//       name: 'Anthony Shao',
//       avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
//       title: 'Senior React Developer'
//     },
//     duration: '12h 30m',
//     level: 'Intermediate',
//     rating: 4.8,
//     studentsCount: 18500,
//     price: 299,
//     originalPrice: 399,
//     isEnrolled: true,
//     completionPercentage: 45,
//     totalLessons: 25,
//     completedLessons: 11,
//     sections: [
//       {
//         id: 'section-1',
//         title: 'React Fundamentals',
//         isExpanded: true,
//         progress: { completed: 5, total: 10, duration: '82 mins' },
//         lessons: [
//           {
//             id: 'lesson-1',
//             title: 'Introduction to React',
//             duration: '6 mins',
//             isCompleted: true,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
//             description: 'Get started with React and understand its core concepts.'
//           },
//           {
//             id: 'lesson-2',
//             title: 'JSX and Components',
//             duration: '8 mins',
//             isCompleted: true,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
//             description: 'Learn JSX syntax and how to create reusable components.'
//           },
//           {
//             id: 'lesson-3',
//             title: 'Props and State',
//             duration: '10 mins',
//             isCompleted: true,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
//             description: 'Master props and state management in React components.'
//           },
//           {
//             id: 'lesson-4',
//             title: 'Event Handling',
//             duration: '7 mins',
//             isCompleted: true,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
//             description: 'Handle user interactions and events in React applications.'
//           },
//           {
//             id: 'lesson-5',
//             title: 'Conditional Rendering',
//             duration: '6 mins',
//             isCompleted: true,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
//             description: 'Learn how to conditionally render content in React.'
//           },
//           {
//             id: 'lesson-6',
//             title: 'Lists and Keys',
//             duration: '8 mins',
//             isCompleted: false,
//             isCurrent: true,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
//             description: 'Render lists efficiently with proper key usage.',
//             quiz: {
//               id: 'react-quiz-1',
//               title: 'React Lists and Keys Quiz',
//               description: 'Test your understanding of rendering lists in React',
//               questions: [
//                 {
//                   id: 'rq1',
//                   quizId: 'react-quiz-1',
//                   questionText: 'Why do we need keys when rendering lists in React?',
//                   questionType: 'multiple_choice',
//                   points: 10,
//                   options: [
//                     { id: 'a', text: 'Keys make the code more readable', isCorrect: false, order: 1 },
//                     { id: 'b', text: 'Keys help React identify which items have changed', isCorrect: true, order: 2 },
//                     { id: 'c', text: 'Keys are required for all JSX elements', isCorrect: false, order: 3 },
//                     { id: 'd', text: 'Keys improve performance by caching components', isCorrect: false, order: 4 }
//                   ],
//                   correctAnswer: 'b',
//                   explanation: 'Keys help React identify which items have changed, been added, or removed, enabling efficient updates.',
//                   order: 1
//                 },
//                 {
//                   id: 'rq2',
//                   quizId: 'react-quiz-1',
//                   questionText: 'Array indices should always be used as keys for list items.',
//                   questionType: 'true_false',
//                   points: 5,
//                   options: [
//                     { id: 'true', text: 'True', isCorrect: false, order: 1 },
//                     { id: 'false', text: 'False', isCorrect: true, order: 2 }
//                   ],
//                   correctAnswer: 'false',
//                   explanation: 'Array indices should not be used as keys when the list order can change, as it can cause performance issues.',
//                   order: 2
//                 }
//               ],
//               passingScore: 70,
//               maxAttempts: 3,
//               timeLimit: 5,
//               isRequired: true,
//               isActive: true
//             }
//           },
//           {
//             id: 'lesson-7',
//             title: 'React Hooks - useState',
//             duration: '9 mins',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
//             description: 'Master the useState hook for state management in functional components.'
//           },
//           {
//             id: 'lesson-8',
//             title: 'React Hooks - useEffect',
//             duration: '11 mins',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
//             description: 'Learn useEffect hook for side effects and lifecycle management.'
//           },
//           {
//             id: 'lesson-9',
//             title: 'Custom Hooks',
//             duration: '7 mins',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
//             description: 'Create and use custom hooks to share logic between components.'
//           },
//           {
//             id: 'lesson-10',
//             title: 'Context API',
//             duration: '10 mins',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
//             description: 'Manage global state with React Context API.'
//           }
//         ]
//       }
//     ]
//   },
//   'design-thinking-for-innovation': {
//     id: '5',
//     title: 'Design Thinking for Innovation',
//     slug: 'design-thinking-for-innovation',
//     description: 'Learn the design thinking methodology to solve complex problems and create innovative solutions that users love.',
//     shortDescription: 'Master design thinking methodology for innovation',
//     progress: 0,
//     thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop',
//     videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
//     instructor: {
//       name: 'Sarah Johnson',
//       avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
//       title: 'UX Design Lead'
//     },
//     duration: '3h 15m',
//     level: 'Beginner',
//     rating: 4.7,
//     studentsCount: 12300,
//     price: 199,
//     originalPrice: 299,
//     isEnrolled: false,
//     completionPercentage: 0,
//     totalLessons: 12,
//     completedLessons: 0,
//     sections: [
//       {
//         id: 'section-1',
//         title: 'Introduction to Design Thinking',
//         isExpanded: true,
//         progress: { completed: 0, total: 8, duration: '44 mins' },
//         lessons: [
//           {
//             id: 'lesson-1',
//             title: 'What is Design Thinking?',
//             duration: '5 mins',
//             isCompleted: false,
//             isCurrent: true,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
//             description: 'Introduction to design thinking methodology and its benefits.',
//             quiz: {
//               id: 'design-quiz-1',
//               title: 'Design Thinking Fundamentals Quiz',
//               description: 'Test your understanding of design thinking methodology',
//               questions: [
//                 {
//                   id: 'dq1',
//                   quizId: 'design-quiz-1',
//                   questionText: 'What is the primary goal of design thinking?',
//                   questionType: 'multiple_choice',
//                   points: 10,
//                   options: [
//                     { id: 'a', text: 'To create beautiful designs', isCorrect: false, order: 1 },
//                     { id: 'b', text: 'To solve complex problems with user-centered solutions', isCorrect: true, order: 2 },
//                     { id: 'c', text: 'To reduce development costs', isCorrect: false, order: 3 },
//                     { id: 'd', text: 'To speed up the design process', isCorrect: false, order: 4 }
//                   ],
//                   correctAnswer: 'b',
//                   explanation: 'Design thinking focuses on solving complex problems through user-centered, creative solutions.',
//                   order: 1
//                 },
//                 {
//                   id: 'dq2',
//                   quizId: 'design-quiz-1',
//                   questionText: 'Design thinking is only useful for designers.',
//                   questionType: 'true_false',
//                   points: 5,
//                   options: [
//                     { id: 'true', text: 'True', isCorrect: false, order: 1 },
//                     { id: 'false', text: 'False', isCorrect: true, order: 2 }
//                   ],
//                   correctAnswer: 'false',
//                   explanation: 'Design thinking can be applied by anyone in any field to solve problems creatively.',
//                   order: 2
//                 }
//               ],
//               passingScore: 70,
//               maxAttempts: 3,
//               timeLimit: 5,
//               isRequired: true,
//               isActive: true
//             }
//           },
//           {
//             id: 'lesson-2',
//             title: 'The 5 Stages of Design Thinking',
//             duration: '6 mins',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
//             description: 'Learn the five stages: Empathize, Define, Ideate, Prototype, and Test.'
//           },
//           {
//             id: 'lesson-3',
//             title: 'Empathy in Design',
//             duration: '4 mins',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
//             description: 'Understand the importance of empathy in the design process.'
//           },
//           {
//             id: 'lesson-4',
//             title: 'Problem Definition',
//             duration: '3 mins',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
//             description: 'Learn how to define problems clearly and effectively.'
//           },
//           {
//             id: 'lesson-5',
//             title: 'Ideation Techniques',
//             duration: '7 mins',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
//             description: 'Master various ideation techniques like brainstorming and mind mapping.'
//           },
//           {
//             id: 'lesson-6',
//             title: 'Prototyping and Testing',
//             duration: '8 mins',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
//             description: 'Learn how to create prototypes and test your ideas effectively.'
//           },
//           {
//             id: 'lesson-7',
//             title: 'User Research Methods',
//             duration: '6 mins',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
//             description: 'Explore different user research methods and when to use them.'
//           },
//           {
//             id: 'lesson-8',
//             title: 'Design Thinking Tools',
//             duration: '5 mins',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
//             description: 'Discover useful tools and frameworks for design thinking.'
//           }
//         ]
//       }
//     ]
//   },
//   'business-strategy-fundamentals': {
//     id: '6',
//     title: 'Business Strategy Fundamentals',
//     slug: 'business-strategy-fundamentals',
//     description: 'Master the fundamentals of business strategy and learn how to develop, implement, and execute strategic plans for business success.',
//     shortDescription: 'Learn business strategy fundamentals for success',
//     progress: 0,
//     thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop',
//     videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
//     instructor: {
//       name: 'Michael Chen',
//       avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face',
//       title: 'Business Strategy Consultant'
//     },
//     duration: '4h 20m',
//     level: 'Intermediate',
//     rating: 4.6,
//     studentsCount: 9800,
//     price: 249,
//     originalPrice: 349,
//     isEnrolled: false,
//     completionPercentage: 0,
//     totalLessons: 18,
//     completedLessons: 0,
//     sections: [
//       {
//         id: 'section-1',
//         title: 'Strategic Planning Basics',
//         isExpanded: true,
//         progress: { completed: 0, total: 10, duration: '50 mins' },
//         lessons: [
//           {
//             id: 'lesson-1',
//             title: 'What is Business Strategy?',
//             duration: '4 mins',
//             isCompleted: false,
//             isCurrent: true,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
//             description: 'Introduction to business strategy and its importance in organizational success.',
//             quiz: {
//               id: 'business-quiz-1',
//               title: 'Business Strategy Fundamentals Quiz',
//               description: 'Test your understanding of business strategy concepts',
//               questions: [
//                 {
//                   id: 'bq1',
//                   quizId: 'business-quiz-1',
//                   questionText: 'What is the primary purpose of a business strategy?',
//                   questionType: 'multiple_choice',
//                   points: 10,
//                   options: [
//                     { id: 'a', text: 'To increase employee satisfaction', isCorrect: false, order: 1 },
//                     { id: 'b', text: 'To achieve competitive advantage and organizational goals', isCorrect: true, order: 2 },
//                     { id: 'c', text: 'To reduce operational costs', isCorrect: false, order: 3 },
//                     { id: 'd', text: 'To improve product quality', isCorrect: false, order: 4 }
//                   ],
//                   correctAnswer: 'b',
//                   explanation: 'Business strategy aims to achieve competitive advantage and help organizations reach their long-term goals.',
//                   order: 1
//                 },
//                 {
//                   id: 'bq2',
//                   quizId: 'business-quiz-1',
//                   questionText: 'A good business strategy should be flexible and adaptable to changing market conditions.',
//                   questionType: 'true_false',
//                   points: 5,
//                   options: [
//                     { id: 'true', text: 'True', isCorrect: true, order: 1 },
//                     { id: 'false', text: 'False', isCorrect: false, order: 2 }
//                   ],
//                   correctAnswer: 'true',
//                   explanation: 'Yes, effective strategies must be flexible enough to adapt to changing market conditions and opportunities.',
//                   order: 2
//                 }
//               ],
//               passingScore: 70,
//               maxAttempts: 3,
//               timeLimit: 5,
//               isRequired: true,
//               isActive: true
//             }
//           },
//           {
//             id: 'lesson-2',
//             title: 'SWOT Analysis',
//             duration: '5 mins',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
//             description: 'Master SWOT analysis to assess your business strengths, weaknesses, opportunities, and threats.'
//           },
//           {
//             id: 'lesson-3',
//             title: 'Competitive Analysis',
//             duration: '4 mins',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
//             description: 'Learn how to analyze competitors and identify competitive advantages.'
//           },
//           {
//             id: 'lesson-4',
//             title: 'Market Positioning',
//             duration: '5 mins',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
//             description: 'Understand market positioning strategies and how to differentiate your business.'
//           },
//           {
//             id: 'lesson-5',
//             title: 'Strategic Goals Setting',
//             duration: '4 mins',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
//             description: 'Set clear, measurable strategic goals that align with your business vision.'
//           },
//           {
//             id: 'lesson-6',
//             title: 'Resource Allocation',
//             duration: '6 mins',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
//             description: 'Learn how to allocate resources effectively to achieve strategic objectives.'
//           },
//           {
//             id: 'lesson-7',
//             title: 'Risk Management',
//             duration: '5 mins',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
//             description: 'Identify and manage risks that could impact your business strategy.'
//           },
//           {
//             id: 'lesson-8',
//             title: 'Strategic Implementation',
//             duration: '7 mins',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
//             description: 'Learn how to implement and execute your business strategy effectively.'
//           },
//           {
//             id: 'lesson-9',
//             title: 'Performance Measurement',
//             duration: '4 mins',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
//             description: 'Establish KPIs and metrics to measure strategic performance.'
//           },
//           {
//             id: 'lesson-10',
//             title: 'Strategic Planning Tools',
//             duration: '6 mins',
//             isCompleted: false,
//             isCurrent: false,
//             videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
//             description: 'Explore various tools and frameworks for strategic planning.'
//           }
//         ]
//       }
//     ]
//   }
// }
