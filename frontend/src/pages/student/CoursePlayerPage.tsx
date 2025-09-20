import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import CoursePlayerSidebar from '../../components/student/coursePlayer/CoursePlayerSidebar'
import CourseVideoPlayer from '../../components/student/coursePlayer/CourseVideoPlayer'
import LessonQuizComponent from '../../components/student/learning/LessonQuiz'
import { 
  Share, 
  Bell,
  ShoppingCart,
  MessageCircle
} from 'lucide-react'
import UserProfileDropdown from '../../components/navigation/user-actions/UserProfileDropdown'
import type { LessonQuiz as LessonQuizType, QuizResult } from '../../types/quiz'
import type { Course, Lesson } from '../../types/course'

// Sample course data
const sampleCourses: Record<string, Course> = {
  'goal-setting-masterclass-achieve-your-dreams': {
    id: '1',
    title: 'Goal Setting Masterclass: Achieve Your Dreams',
    slug: 'goal-setting-masterclass-achieve-your-dreams',
    description: 'Learn the fundamentals of goal setting and achieve your dreams with this comprehensive masterclass. Master proven techniques used by successful people to set, track, and achieve their goals.',
    shortDescription: 'Master the art of goal setting and turn your dreams into reality',
    progress: 15,
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=450&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    instructor: {
      name: 'Steven Ford',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
      title: 'Productivity Expert & Life Coach'
    },
    duration: '2h 30m',
    level: 'Beginner',
    rating: 4.8,
    studentsCount: 12500,
    price: 89,
    originalPrice: 149,
    isEnrolled: true,
    lastAccessed: '2024-01-15',
    completionPercentage: 15,
    totalLessons: 8,
    completedLessons: 1,
    sections: [
      {
        id: 'section-1',
        title: 'Understanding Goals and Why They Matter',
        isExpanded: true,
        progress: { completed: 1, total: 3, duration: '13 mins 5 sec' },
            quiz: {
          id: 'section-1-quiz',
          title: 'Goals and Vision Quiz',
          description: 'Test your understanding of goal setting fundamentals and vision creation',
              questions: [
                {
              id: 'sq1',
              quizId: 'section-1-quiz',
                  questionText: 'What is the most important characteristic of effective goals?',
                  options: [
                    { id: 'a', text: 'They should be easy to achieve', isCorrect: false, order: 1 },
                    { id: 'b', text: 'They should be specific and measurable', isCorrect: true, order: 2 },
                    { id: 'c', text: 'They should be vague and flexible', isCorrect: false, order: 3 },
                    { id: 'd', text: 'They should be set by others', isCorrect: false, order: 4 }
                  ],
                  correctAnswer: 'b',
                  explanation: 'Effective goals are specific, measurable, achievable, relevant, and time-bound (SMART).',
                  order: 1
                },
                {
              id: 'sq2',
              quizId: 'section-1-quiz',
              questionText: 'What is the primary purpose of a vision board?',
                  options: [
                { id: 'a', text: 'To decorate your workspace', isCorrect: false, order: 1 },
                { id: 'b', text: 'To visualize and reinforce your goals', isCorrect: true, order: 2 },
                { id: 'c', text: 'To track your daily tasks', isCorrect: false, order: 3 },
                { id: 'd', text: 'To organize your schedule', isCorrect: false, order: 4 }
              ],
              correctAnswer: 'b',
              explanation: 'A vision board helps you visualize your goals and keeps them at the forefront of your mind.',
                  order: 2
            },
            {
              id: 'sq3',
              quizId: 'section-1-quiz',
              questionText: 'How long do short-term goals typically span?',
              options: [
                { id: 'a', text: '1-3 days', isCorrect: false, order: 1 },
                { id: 'b', text: '1-3 weeks', isCorrect: false, order: 2 },
                { id: 'c', text: '1-3 months', isCorrect: true, order: 3 },
                { id: 'd', text: '1-3 years', isCorrect: false, order: 4 }
              ],
              correctAnswer: 'c',
              explanation: 'Short-term goals are typically achievable within 1-3 months.',
              order: 3
                }
              ],
              passingScore: 70,
          timeLimit: 10,
              isActive: true
        },
        lessons: [
          {
            id: 'lesson-1',
            title: 'The Importance of Goal Setting',
            duration: '4 mins 30 sec',
            isCompleted: true,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            description: 'Learn why goal setting is crucial for success and how it can transform your life.'
          },
          {
            id: 'lesson-2',
            title: 'Types of Goals: Short-term vs Long-term',
            duration: '4 mins 15 sec',
            isCompleted: false,
            isCurrent: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            description: 'Understand the difference between short-term and long-term goals and how to balance them.'
          },
          {
            id: 'lesson-3',
            title: 'Creating a Vision Board',
            duration: '4 mins 20 sec',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            description: 'Learn how to create an effective vision board to visualize your goals.'
          }
        ]
      },
      {
        id: 'goal-section-2',
        title: 'Setting and Achieving Your Goals',
        isExpanded: false,
        progress: { completed: 0, total: 3, duration: '18 mins 30 sec' },
        quiz: {
          id: 'section-2-quiz',
          title: 'SMART Goals and Achievement Quiz',
          description: 'Test your knowledge of SMART goals framework and goal achievement strategies',
          questions: [
            {
              id: 'sq4',
              quizId: 'section-2-quiz',
              questionText: 'What does the "S" in SMART goals stand for?',
              options: [
                { id: 'a', text: 'Simple', isCorrect: false, order: 1 },
                { id: 'b', text: 'Specific', isCorrect: true, order: 2 },
                { id: 'c', text: 'Short', isCorrect: false, order: 3 },
                { id: 'd', text: 'Strong', isCorrect: false, order: 4 }
              ],
              correctAnswer: 'b',
              explanation: 'The "S" in SMART goals stands for Specific - goals should be clear and well-defined.',
              order: 1
            },
            {
              id: 'sq5',
              quizId: 'section-2-quiz',
              questionText: 'What is the benefit of breaking down big goals into smaller steps?',
              options: [
                { id: 'a', text: 'It makes them more complex', isCorrect: false, order: 1 },
                { id: 'b', text: 'It makes them more achievable', isCorrect: true, order: 2 },
                { id: 'c', text: 'It makes them take longer', isCorrect: false, order: 3 },
                { id: 'd', text: 'It makes them less important', isCorrect: false, order: 4 }
              ],
              correctAnswer: 'b',
              explanation: 'Breaking down large goals into smaller, manageable steps increases the likelihood of success.',
              order: 2
            },
            {
              id: 'sq6',
              quizId: 'section-2-quiz',
              questionText: 'What is the most effective way to track goal progress?',
              options: [
                { id: 'a', text: 'Set it and forget it', isCorrect: false, order: 1 },
                { id: 'b', text: 'Regular review and adjustment', isCorrect: true, order: 2 },
                { id: 'c', text: 'Only check at the end', isCorrect: false, order: 3 },
                { id: 'd', text: 'Ask others to track for you', isCorrect: false, order: 4 }
              ],
              correctAnswer: 'b',
              explanation: 'Regular review and adjustment of goals helps maintain momentum and adapt to changing circumstances.',
              order: 3
            }
          ],
          passingScore: 70,
          timeLimit: 10,
          isActive: true
        },
        quizCompleted: false,
        isUnlocked: false,
        lessons: [
          {
            id: 'lesson-4',
            title: 'SMART Goals Framework',
            duration: '6 mins 15 sec',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            description: 'Learn the SMART framework for setting effective and achievable goals.'
          },
          {
            id: 'lesson-5',
            title: 'Breaking Down Big Goals',
            duration: '6 mins 30 sec',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            description: 'Master the art of breaking down large goals into manageable steps.'
          },
          {
            id: 'lesson-6',
            title: 'Tracking Your Progress',
            duration: '5 mins 45 sec',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            description: 'Learn effective methods to track and monitor your goal progress.'
          }
        ]
      },
      {
        id: 'goal-section-3',
        title: 'Advanced Goal Achievement Strategies',
        isExpanded: false,
        progress: { completed: 0, total: 4, duration: '18 mins 30 sec' },
        quiz: {
          id: 'section-2-quiz',
          title: 'Advanced Goal Achievement Quiz',
          description: 'Test your knowledge of advanced goal setting and achievement strategies',
          questions: [
            {
              id: 'sq4',
              quizId: 'section-2-quiz',
              questionText: 'What is the most effective way to maintain motivation for long-term goals?',
              options: [
                { id: 'a', text: 'Set only short-term goals', isCorrect: false, order: 1 },
                { id: 'b', text: 'Celebrate small wins along the way', isCorrect: true, order: 2 },
                { id: 'c', text: 'Work on goals alone without support', isCorrect: false, order: 3 },
                { id: 'd', text: 'Avoid reviewing progress regularly', isCorrect: false, order: 4 }
              ],
              correctAnswer: 'b',
              explanation: 'Celebrating small wins helps maintain motivation and momentum toward long-term goals.',
              order: 1
            },
            {
              id: 'sq5',
              quizId: 'section-2-quiz',
              questionText: 'What is the benefit of having an accountability partner?',
              options: [
                { id: 'a', text: 'They can do the work for you', isCorrect: false, order: 1 },
                { id: 'b', text: 'They provide support and keep you accountable', isCorrect: true, order: 2 },
                { id: 'c', text: 'They reduce the difficulty of goals', isCorrect: false, order: 3 },
                { id: 'd', text: 'They eliminate the need for planning', isCorrect: false, order: 4 }
              ],
              correctAnswer: 'b',
              explanation: 'An accountability partner provides support, encouragement, and helps keep you on track.',
              order: 2
            },
            {
              id: 'sq6',
              quizId: 'section-2-quiz',
              questionText: 'What should you do when you face obstacles in achieving your goals?',
              options: [
                { id: 'a', text: 'Give up immediately', isCorrect: false, order: 1 },
                { id: 'b', text: 'Lower your expectations', isCorrect: false, order: 2 },
                { id: 'c', text: 'Analyze the obstacle and adjust your approach', isCorrect: true, order: 3 },
                { id: 'd', text: 'Ignore the obstacle and continue as planned', isCorrect: false, order: 4 }
              ],
              correctAnswer: 'c',
              explanation: 'When facing obstacles, analyze them and adjust your approach rather than giving up.',
              order: 3
            }
          ],
          passingScore: 70,
          timeLimit: 10,
          isActive: true
        },
        quizCompleted: false,
        isUnlocked: false,
        lessons: [
          {
            id: 'lesson-7',
            title: 'Maintaining Motivation for Long-term Goals',
            duration: '4 mins 30 sec',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            description: 'Learn strategies to maintain motivation throughout your goal achievement journey.'
          },
          {
            id: 'lesson-8',
            title: 'Building an Accountability System',
            duration: '4 mins 45 sec',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            description: 'Create a support system to help you stay accountable to your goals.'
          },
          {
            id: 'lesson-9',
            title: 'Overcoming Obstacles and Setbacks',
            duration: '4 mins 30 sec',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
            description: 'Develop resilience and strategies to overcome challenges in goal achievement.'
          },
          {
            id: 'lesson-10',
            title: 'Reviewing and Adjusting Your Goals',
            duration: '4 mins 45 sec',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
            description: 'Learn when and how to review and adjust your goals for better outcomes.'
          }
        ]
      }
    ]
  },
  'focus-and-concentration-boost-achieve-more': {
    id: '2',
    title: 'Focus and Concentration Boost: Achieve More',
    slug: 'focus-and-concentration-boost-achieve-more',
    description: 'Master the art of focus and concentration to boost your productivity and achieve more in less time.',
    shortDescription: 'Boost your focus and concentration for maximum productivity',
    progress: 0,
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    instructor: {
      name: 'Steven Ford',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
      title: 'Productivity Expert'
    },
    duration: '1h 45m',
    level: 'Intermediate',
    rating: 4.7,
    studentsCount: 8900,
    price: 79,
    originalPrice: 129,
    isEnrolled: true,
    completionPercentage: 0,
    totalLessons: 6,
    completedLessons: 0,
    sections: [
      {
        id: 'section-1',
        title: 'Introduction to Focus and Concentration',
        isExpanded: true,
        progress: { completed: 0, total: 6, duration: '29 mins 45 sec' },
            quiz: {
          id: 'focus-section-1-quiz',
          title: 'Focus and Concentration Fundamentals Quiz',
          description: 'Test your understanding of focus, concentration, and productivity techniques',
              questions: [
                {
                  id: 'fq1',
              quizId: 'focus-section-1-quiz',
                  questionText: 'What is the primary benefit of maintaining focus?',
                  options: [
                    { id: 'a', text: 'It reduces the need for breaks', isCorrect: false, order: 1 },
                    { id: 'b', text: 'It increases productivity and quality of work', isCorrect: true, order: 2 },
                    { id: 'c', text: 'It eliminates all distractions', isCorrect: false, order: 3 },
                    { id: 'd', text: 'It makes tasks easier to complete', isCorrect: false, order: 4 }
                  ],
                  correctAnswer: 'b',
                  explanation: 'Focus increases productivity and improves the quality of work by allowing deep concentration.',
                  order: 1
                },
                {
                  id: 'fq2',
              quizId: 'focus-section-1-quiz',
              questionText: 'How long is a typical Pomodoro work session?',
                  options: [
                { id: 'a', text: '15 minutes', isCorrect: false, order: 1 },
                { id: 'b', text: '25 minutes', isCorrect: true, order: 2 },
                { id: 'c', text: '45 minutes', isCorrect: false, order: 3 },
                { id: 'd', text: '60 minutes', isCorrect: false, order: 4 }
              ],
              correctAnswer: 'b',
              explanation: 'A typical Pomodoro work session is 25 minutes, followed by a 5-minute break.',
                  order: 2
            },
            {
              id: 'fq3',
              quizId: 'focus-section-1-quiz',
                  questionText: 'What is the most common source of distraction in modern work?',
                  options: [
                    { id: 'a', text: 'Noise from colleagues', isCorrect: false, order: 1 },
                { id: 'b', text: 'Digital notifications', isCorrect: true, order: 2 },
                    { id: 'c', text: 'Poor lighting', isCorrect: false, order: 3 },
                    { id: 'd', text: 'Uncomfortable chairs', isCorrect: false, order: 4 }
                  ],
                  correctAnswer: 'b',
                  explanation: 'Digital notifications and social media are the most common sources of distraction in modern work environments.',
              order: 3
                }
              ],
              passingScore: 70,
          timeLimit: 10,
              isActive: true
        },
        lessons: [
          {
            id: 'lesson-1',
            title: 'What is Focus and Why It Matters',
            duration: '4 mins',
            isCompleted: false,
            isCurrent: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            description: 'Understand the importance of focus in achieving your goals.'
          },
          {
            id: 'lesson-2',
            title: 'Common Distractions and How to Overcome Them',
            duration: '4 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            description: 'Identify and eliminate common distractions that hinder your focus.'
          },
          {
            id: 'lesson-3',
            title: 'The Pomodoro Technique',
            duration: '5 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            description: 'Master the Pomodoro Technique for enhanced productivity and focus.'
          },
          {
            id: 'lesson-4',
            title: 'Mindfulness and Meditation',
            duration: '6 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            description: 'Learn mindfulness techniques to improve your concentration abilities.'
          },
          {
            id: 'lesson-5',
            title: 'Creating a Focus-Friendly Environment',
            duration: '4 mins 30 sec',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            description: 'Design your workspace and environment to maximize focus and productivity.'
          },
          {
            id: 'lesson-6',
            title: 'Building Focus Habits',
            duration: '5 mins 15 sec',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            description: 'Develop sustainable habits that strengthen your focus over time.'
          }
        ]
      },
      {
        id: 'focus-section-2',
        title: 'Advanced Focus Techniques and Deep Work',
        isExpanded: false,
        progress: { completed: 0, total: 5, duration: '22 mins 30 sec' },
        quiz: {
          id: 'focus-section-2-quiz',
          title: 'Advanced Focus Techniques Quiz',
          description: 'Test your understanding of advanced focus techniques and deep work strategies',
          questions: [
            {
              id: 'fq4',
              quizId: 'focus-section-2-quiz',
              questionText: 'What is the concept of "deep work" as described by Cal Newport?',
              options: [
                { id: 'a', text: 'Working for long hours without breaks', isCorrect: false, order: 1 },
                { id: 'b', text: 'Professional activities performed in a state of distraction-free concentration', isCorrect: true, order: 2 },
                { id: 'c', text: 'Working on multiple tasks simultaneously', isCorrect: false, order: 3 },
                { id: 'd', text: 'Working only in the morning hours', isCorrect: false, order: 4 }
              ],
              correctAnswer: 'b',
              explanation: 'Deep work is professional activities performed in a state of distraction-free concentration that push your cognitive capabilities to their limit.',
              order: 1
            },
            {
              id: 'fq5',
              quizId: 'focus-section-2-quiz',
              questionText: 'What is the recommended duration for a deep work session?',
              options: [
                { id: 'a', text: '30 minutes', isCorrect: false, order: 1 },
                { id: 'b', text: '1-2 hours', isCorrect: false, order: 2 },
                { id: 'c', text: '90 minutes to 4 hours', isCorrect: true, order: 3 },
                { id: 'd', text: '6-8 hours', isCorrect: false, order: 4 }
              ],
              correctAnswer: 'c',
              explanation: 'Deep work sessions typically last 90 minutes to 4 hours, depending on your experience and the complexity of the task.',
              order: 2
            },
            {
              id: 'fq6',
              quizId: 'focus-section-2-quiz',
              questionText: 'What is the "flow state" and how can it be achieved?',
              options: [
                { id: 'a', text: 'A state of complete relaxation', isCorrect: false, order: 1 },
                { id: 'b', text: 'A state of optimal performance where you lose track of time', isCorrect: true, order: 2 },
                { id: 'c', text: 'A state of high stress and pressure', isCorrect: false, order: 3 },
                { id: 'd', text: 'A state of multitasking efficiently', isCorrect: false, order: 4 }
              ],
              correctAnswer: 'b',
              explanation: 'Flow state is a state of optimal performance where you are fully immersed in an activity and lose track of time.',
              order: 3
            }
          ],
          passingScore: 70,
          timeLimit: 10,
          isActive: true
        },
        quizCompleted: false,
        isUnlocked: false,
        lessons: [
          {
            id: 'lesson-7',
            title: 'Understanding Deep Work',
            duration: '4 mins 30 sec',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            description: 'Learn the principles of deep work and how it differs from shallow work.'
          },
          {
            id: 'lesson-8',
            title: 'Creating Deep Work Rituals',
            duration: '4 mins 45 sec',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            description: 'Develop rituals and routines that prepare your mind for deep work sessions.'
          },
          {
            id: 'lesson-9',
            title: 'Managing Digital Distractions',
            duration: '4 mins 30 sec',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            description: 'Advanced strategies for eliminating digital distractions during focus time.'
          },
          {
            id: 'lesson-10',
            title: 'Building Focus Endurance',
            duration: '4 mins 45 sec',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            description: 'Gradually increase your ability to maintain focus for longer periods.'
          },
          {
            id: 'lesson-11',
            title: 'Recovery and Rest for Focus',
            duration: '4 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            description: 'Learn the importance of proper rest and recovery for maintaining focus.'
          }
        ]
      }
    ]
  },
  'time-management-mastery': {
    id: '3',
    title: 'Time Management Mastery: Get More Done',
    slug: 'time-management-mastery',
    description: 'Learn proven time management techniques to maximize your productivity and achieve your goals efficiently.',
    shortDescription: 'Master time management for maximum productivity',
    progress: 0,
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    instructor: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
      title: 'Time Management Specialist'
    },
    duration: '2h 15m',
    level: 'Beginner',
    rating: 4.9,
    studentsCount: 15200,
    price: 95,
    originalPrice: 159,
    isEnrolled: false,
    completionPercentage: 0,
    totalLessons: 10,
    completedLessons: 0,
    sections: [
      {
        id: 'section-1',
        title: 'Fundamentals of Time Management',
        isExpanded: true,
        progress: { completed: 0, total: 7, duration: '32 mins 15 sec' },
            quiz: {
          id: 'time-section-1-quiz',
          title: 'Time Management Fundamentals Quiz',
          description: 'Test your understanding of time management principles and techniques',
              questions: [
                {
                  id: 'tq1',
              quizId: 'time-section-1-quiz',
                  questionText: 'What is the main difference between time and energy management?',
                  options: [
                    { id: 'a', text: 'Time is finite, energy can be renewed', isCorrect: true, order: 1 },
                    { id: 'b', text: 'Time is renewable, energy is finite', isCorrect: false, order: 2 },
                    { id: 'c', text: 'There is no difference between them', isCorrect: false, order: 3 },
                    { id: 'd', text: 'Time management is more important', isCorrect: false, order: 4 }
                  ],
                  correctAnswer: 'a',
                  explanation: 'Time is finite and cannot be renewed, while energy can be restored through rest, nutrition, and exercise.',
                  order: 1
                },
                {
                  id: 'tq2',
              quizId: 'time-section-1-quiz',
              questionText: 'In the Eisenhower Matrix, which quadrant contains urgent and important tasks?',
                  options: [
                    { id: 'a', text: 'Quadrant 1: Do First', isCorrect: true, order: 1 },
                    { id: 'b', text: 'Quadrant 2: Schedule', isCorrect: false, order: 2 },
                    { id: 'c', text: 'Quadrant 3: Delegate', isCorrect: false, order: 3 },
                    { id: 'd', text: 'Quadrant 4: Eliminate', isCorrect: false, order: 4 }
                  ],
                  correctAnswer: 'a',
                  explanation: 'Quadrant 1 contains tasks that are both urgent and important - these should be done first.',
              order: 2
            },
            {
              id: 'tq3',
              quizId: 'time-section-1-quiz',
              questionText: 'What is the main benefit of time blocking?',
                  options: [
                { id: 'a', text: 'It increases the number of tasks you can do', isCorrect: false, order: 1 },
                { id: 'b', text: 'It reduces context switching between different tasks', isCorrect: true, order: 2 },
                { id: 'c', text: 'It makes tasks take longer to complete', isCorrect: false, order: 3 },
                { id: 'd', text: 'It eliminates the need for breaks', isCorrect: false, order: 4 }
              ],
              correctAnswer: 'b',
              explanation: 'Time blocking reduces context switching by dedicating specific time blocks to similar tasks.',
              order: 3
                }
              ],
              passingScore: 70,
          timeLimit: 10,
              isActive: true
        },
        lessons: [
          {
            id: 'lesson-1',
            title: 'Understanding Time vs Energy',
            duration: '4 mins',
            isCompleted: false,
            isCurrent: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            description: 'Learn the difference between time and energy management for better productivity.'
          },
          {
            id: 'lesson-2',
            title: 'The Eisenhower Matrix',
            duration: '4 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            description: 'Master the Eisenhower Matrix for prioritizing tasks effectively.'
          },
          {
            id: 'lesson-3',
            title: 'Time Blocking Techniques',
            duration: '4 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            description: 'Implement time blocking strategies to maximize your daily productivity.'
          },
          {
            id: 'lesson-4',
            title: 'Eliminating Time Wasters',
            duration: '5 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            description: 'Identify and eliminate activities that waste your valuable time.'
          },
          {
            id: 'lesson-5',
            title: 'Delegation and Outsourcing',
            duration: '6 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            description: 'Learn when and how to delegate tasks to free up your time.'
          },
          {
            id: 'lesson-6',
            title: 'Digital Tools for Time Management',
            duration: '5 mins 30 sec',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            description: 'Explore digital tools and apps that can enhance your time management.'
          },
          {
            id: 'lesson-7',
            title: 'Building Time Management Habits',
            duration: '4 mins 45 sec',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            description: 'Develop sustainable habits that improve your time management skills.'
          }
        ]
      },
      {
        id: 'time-section-2',
        title: 'Advanced Time Management Strategies',
        isExpanded: false,
        progress: { completed: 0, total: 4, duration: '18 mins 15 sec' },
        quiz: {
          id: 'time-section-2-quiz',
          title: 'Advanced Time Management Quiz',
          description: 'Test your knowledge of advanced time management strategies and productivity systems',
          questions: [
            {
              id: 'tq4',
              quizId: 'time-section-2-quiz',
              questionText: 'What is the "Two-Minute Rule" in productivity?',
              options: [
                { id: 'a', text: 'Spend only two minutes on each task', isCorrect: false, order: 1 },
                { id: 'b', text: 'If a task takes less than two minutes, do it immediately', isCorrect: true, order: 2 },
                { id: 'c', text: 'Take a two-minute break every hour', isCorrect: false, order: 3 },
                { id: 'd', text: 'Complete tasks in two-minute intervals', isCorrect: false, order: 4 }
              ],
              correctAnswer: 'b',
              explanation: 'The Two-Minute Rule states that if a task takes less than two minutes, you should do it immediately rather than adding it to your to-do list.',
              order: 1
            },
            {
              id: 'tq5',
              quizId: 'time-section-2-quiz',
              questionText: 'What is the purpose of a "weekly review" in time management?',
              options: [
                { id: 'a', text: 'To plan all tasks for the week', isCorrect: false, order: 1 },
                { id: 'b', text: 'To reflect on the past week and plan the next', isCorrect: true, order: 2 },
                { id: 'c', text: 'To review only completed tasks', isCorrect: false, order: 3 },
                { id: 'd', text: 'To eliminate all uncompleted tasks', isCorrect: false, order: 4 }
              ],
              correctAnswer: 'b',
              explanation: 'A weekly review helps you reflect on what you accomplished, what you learned, and plan effectively for the upcoming week.',
              order: 2
            },
            {
              id: 'tq6',
              quizId: 'time-section-2-quiz',
              questionText: 'What is "batching" in time management?',
              options: [
                { id: 'a', text: 'Working on multiple projects simultaneously', isCorrect: false, order: 1 },
                { id: 'b', text: 'Grouping similar tasks together to work on them consecutively', isCorrect: true, order: 2 },
                { id: 'c', text: 'Completing tasks in alphabetical order', isCorrect: false, order: 3 },
                { id: 'd', text: 'Working in teams of two people', isCorrect: false, order: 4 }
              ],
              correctAnswer: 'b',
              explanation: 'Batching involves grouping similar tasks together and completing them consecutively to reduce context switching and increase efficiency.',
              order: 3
            }
          ],
          passingScore: 70,
          timeLimit: 10,
          isActive: true
        },
        quizCompleted: false,
        isUnlocked: false,
        lessons: [
          {
            id: 'lesson-8',
            title: 'The Two-Minute Rule and Quick Wins',
            duration: '4 mins 30 sec',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            description: 'Learn how to identify and handle quick tasks immediately to reduce mental clutter.'
          },
          {
            id: 'lesson-9',
            title: 'Weekly Review and Planning',
            duration: '4 mins 45 sec',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            description: 'Master the weekly review process to improve your planning and productivity.'
          },
          {
            id: 'lesson-10',
            title: 'Task Batching and Batch Processing',
            duration: '4 mins 30 sec',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            description: 'Learn how to group similar tasks together for maximum efficiency.'
          },
          {
            id: 'lesson-11',
            title: 'Energy Management and Peak Performance',
            duration: '4 mins 30 sec',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
            description: 'Understand your energy patterns and schedule tasks accordingly for peak performance.'
          }
        ]
      }
    ]
  },
  'react-development-mastery-zero-to-hero': {
    id: '4',
    title: 'React Development Mastery: From Zero to Hero',
    slug: 'react-development-mastery-zero-to-hero',
    description: 'Master React development from the ground up. Learn modern React patterns, hooks, state management, and build real-world applications.',
    shortDescription: 'Complete React development course from beginner to advanced',
    progress: 45,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    instructor: {
      name: 'Anthony Shao',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
      title: 'Senior React Developer'
    },
    duration: '12h 30m',
    level: 'Intermediate',
    rating: 4.8,
    studentsCount: 18500,
    price: 299,
    originalPrice: 399,
    isEnrolled: true,
    completionPercentage: 45,
    totalLessons: 25,
    completedLessons: 11,
    sections: [
      {
        id: 'section-1',
        title: 'React Fundamentals',
        isExpanded: true,
        progress: { completed: 5, total: 10, duration: '82 mins' },
        quiz: {
          id: 'react-section-1-quiz',
          title: 'React Fundamentals Quiz',
          description: 'Test your understanding of React basics, components, and hooks',
          questions: [
            {
              id: 'rq1',
              quizId: 'react-section-1-quiz',
              questionText: 'Why do we need keys when rendering lists in React?',
              options: [
                { id: 'a', text: 'Keys make the code more readable', isCorrect: false, order: 1 },
                { id: 'b', text: 'Keys help React identify which items have changed', isCorrect: true, order: 2 },
                { id: 'c', text: 'Keys are required for all JSX elements', isCorrect: false, order: 3 },
                { id: 'd', text: 'Keys improve performance by caching components', isCorrect: false, order: 4 }
              ],
              correctAnswer: 'b',
              explanation: 'Keys help React identify which items have changed, been added, or removed, enabling efficient updates.',
              order: 1
            },
            {
              id: 'rq2',
              quizId: 'react-section-1-quiz',
              questionText: 'When should array indices be used as keys for list items?',
              options: [
                { id: 'a', text: 'Always, as they are the most efficient', isCorrect: false, order: 1 },
                { id: 'b', text: 'Never, as they can cause performance issues', isCorrect: false, order: 2 },
                { id: 'c', text: 'Only when the list order never changes', isCorrect: true, order: 3 },
                { id: 'd', text: 'Only for small lists with less than 10 items', isCorrect: false, order: 4 }
              ],
              correctAnswer: 'c',
              explanation: 'Array indices should only be used as keys when the list order never changes, otherwise it can cause performance issues.',
              order: 2
            },
            {
              id: 'rq3',
              quizId: 'react-section-1-quiz',
              questionText: 'What is the primary purpose of the useState hook?',
              options: [
                { id: 'a', text: 'To perform side effects', isCorrect: false, order: 1 },
                { id: 'b', text: 'To manage state in functional components', isCorrect: true, order: 2 },
                { id: 'c', text: 'To create class components', isCorrect: false, order: 3 },
                { id: 'd', text: 'To handle events', isCorrect: false, order: 4 }
              ],
              correctAnswer: 'b',
              explanation: 'useState hook allows functional components to manage state, which was previously only possible in class components.',
              order: 3
            }
          ],
          passingScore: 70,
          timeLimit: 15,
          isActive: true
        },
        lessons: [
          {
            id: 'lesson-1',
            title: 'Introduction to React',
            duration: '6 mins',
            isCompleted: true,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            description: 'Get started with React and understand its core concepts.'
          },
          {
            id: 'lesson-2',
            title: 'JSX and Components',
            duration: '8 mins',
            isCompleted: true,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            description: 'Learn JSX syntax and how to create reusable components.'
          },
          {
            id: 'lesson-3',
            title: 'Props and State',
            duration: '10 mins',
            isCompleted: true,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            description: 'Master props and state management in React components.'
          },
          {
            id: 'lesson-4',
            title: 'Event Handling',
            duration: '7 mins',
            isCompleted: true,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            description: 'Handle user interactions and events in React applications.'
          },
          {
            id: 'lesson-5',
            title: 'Conditional Rendering',
            duration: '6 mins',
            isCompleted: true,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            description: 'Learn how to conditionally render content in React.'
          },
          {
            id: 'lesson-6',
            title: 'Lists and Keys',
            duration: '8 mins',
            isCompleted: false,
            isCurrent: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            description: 'Render lists efficiently with proper key usage.'
          },
          {
            id: 'lesson-7',
            title: 'React Hooks - useState',
            duration: '9 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            description: 'Master the useState hook for state management in functional components.'
          },
          {
            id: 'lesson-8',
            title: 'React Hooks - useEffect',
            duration: '11 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            description: 'Learn useEffect hook for side effects and lifecycle management.'
          },
          {
            id: 'lesson-9',
            title: 'Custom Hooks',
            duration: '7 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            description: 'Create and use custom hooks to share logic between components.'
          },
          {
            id: 'lesson-10',
            title: 'Context API',
            duration: '10 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            description: 'Manage global state with React Context API.'
          }
        ]
      },
      {
        id: 'react-section-2',
        title: 'Advanced React Patterns and State Management',
        isExpanded: false,
        progress: { completed: 0, total: 5, duration: '45 mins' },
        quiz: {
          id: 'react-section-2-quiz',
          title: 'Advanced React Patterns Quiz',
          description: 'Test your understanding of advanced React patterns and state management',
          questions: [
            {
              id: 'rq4',
              quizId: 'react-section-2-quiz',
              questionText: 'What is the purpose of useReducer hook in React?',
              options: [
                { id: 'a', text: 'To replace useState for all state management', isCorrect: false, order: 1 },
                { id: 'b', text: 'To manage complex state logic with a reducer function', isCorrect: true, order: 2 },
                { id: 'c', text: 'To create custom hooks', isCorrect: false, order: 3 },
                { id: 'd', text: 'To handle side effects', isCorrect: false, order: 4 }
              ],
              correctAnswer: 'b',
              explanation: 'useReducer is used to manage complex state logic with a reducer function, similar to Redux.',
              order: 1
            },
            {
              id: 'rq5',
              quizId: 'react-section-2-quiz',
              questionText: 'What is the main benefit of using React.memo()?',
              options: [
                { id: 'a', text: 'To create memoized components', isCorrect: false, order: 1 },
                { id: 'b', text: 'To prevent unnecessary re-renders by memoizing components', isCorrect: true, order: 2 },
                { id: 'c', text: 'To create higher-order components', isCorrect: false, order: 3 },
                { id: 'd', text: 'To manage component state', isCorrect: false, order: 4 }
              ],
              correctAnswer: 'b',
              explanation: 'React.memo() prevents unnecessary re-renders by memoizing components when props haven\'t changed.',
              order: 2
            },
            {
              id: 'rq6',
              quizId: 'react-section-2-quiz',
              questionText: 'What is the purpose of useCallback hook?',
              options: [
                { id: 'a', text: 'To create callback functions', isCorrect: false, order: 1 },
                { id: 'b', text: 'To memoize callback functions to prevent unnecessary re-renders', isCorrect: true, order: 2 },
                { id: 'c', text: 'To handle async operations', isCorrect: false, order: 3 },
                { id: 'd', text: 'To manage component lifecycle', isCorrect: false, order: 4 }
              ],
              correctAnswer: 'b',
              explanation: 'useCallback memoizes callback functions to prevent unnecessary re-renders of child components.',
              order: 3
            }
          ],
          passingScore: 70,
          timeLimit: 10,
          isActive: true
        },
        quizCompleted: false,
        isUnlocked: false,
        lessons: [
          {
            id: 'lesson-11',
            title: 'useReducer and Complex State Management',
            duration: '9 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            description: 'Learn useReducer for managing complex state logic with reducers.'
          },
          {
            id: 'lesson-12',
            title: 'React.memo and Performance Optimization',
            duration: '8 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            description: 'Optimize component performance with React.memo and memoization techniques.'
          },
          {
            id: 'lesson-13',
            title: 'useCallback and useMemo Hooks',
            duration: '10 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            description: 'Master useCallback and useMemo for optimizing performance and preventing unnecessary re-renders.'
          },
          {
            id: 'lesson-14',
            title: 'Error Boundaries and Error Handling',
            duration: '9 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            description: 'Implement error boundaries to catch and handle errors gracefully in React applications.'
          },
          {
            id: 'lesson-15',
            title: 'React Patterns and Best Practices',
            duration: '9 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            description: 'Learn advanced React patterns and best practices for building scalable applications.'
          }
        ]
      }
    ]
  },
  'design-thinking-for-innovation': {
    id: '5',
    title: 'Design Thinking for Innovation',
    slug: 'design-thinking-for-innovation',
    description: 'Learn the design thinking methodology to solve complex problems and create innovative solutions that users love.',
    shortDescription: 'Master design thinking methodology for innovation',
    progress: 0,
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    instructor: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
      title: 'UX Design Lead'
    },
    duration: '3h 15m',
    level: 'Beginner',
    rating: 4.7,
    studentsCount: 12300,
    price: 199,
    originalPrice: 299,
    isEnrolled: false,
    completionPercentage: 0,
    totalLessons: 12,
    completedLessons: 0,
    sections: [
      {
        id: 'section-1',
        title: 'Introduction to Design Thinking',
        isExpanded: true,
        progress: { completed: 0, total: 8, duration: '44 mins' },
            quiz: {
          id: 'design-section-1-quiz',
              title: 'Design Thinking Fundamentals Quiz',
          description: 'Test your understanding of design thinking methodology and principles',
              questions: [
                {
                  id: 'dq1',
              quizId: 'design-section-1-quiz',
                  questionText: 'What is the primary goal of design thinking?',
                  options: [
                    { id: 'a', text: 'To create beautiful designs', isCorrect: false, order: 1 },
                    { id: 'b', text: 'To solve complex problems with user-centered solutions', isCorrect: true, order: 2 },
                    { id: 'c', text: 'To reduce development costs', isCorrect: false, order: 3 },
                    { id: 'd', text: 'To speed up the design process', isCorrect: false, order: 4 }
                  ],
                  correctAnswer: 'b',
                  explanation: 'Design thinking focuses on solving complex problems through user-centered, creative solutions.',
                  order: 1
                },
                {
                  id: 'dq2',
              quizId: 'design-section-1-quiz',
                  questionText: 'Who can benefit from design thinking?',
                  options: [
                { id: 'a', text: 'Only professional designers', isCorrect: false, order: 1 },
                { id: 'b', text: 'Only people in creative fields', isCorrect: false, order: 2 },
                { id: 'c', text: 'Anyone in any field to solve problems creatively', isCorrect: true, order: 3 },
                { id: 'd', text: 'Only people working in tech companies', isCorrect: false, order: 4 }
                  ],
              correctAnswer: 'c',
                  explanation: 'Design thinking can be applied by anyone in any field to solve problems creatively.',
                  order: 2
                },
            {
              id: 'dq3',
              quizId: 'design-section-1-quiz',
              questionText: 'How many stages are there in the design thinking process?',
              options: [
                { id: 'a', text: '3 stages', isCorrect: false, order: 1 },
                { id: 'b', text: '5 stages', isCorrect: true, order: 2 },
                { id: 'c', text: '7 stages', isCorrect: false, order: 3 },
                { id: 'd', text: '10 stages', isCorrect: false, order: 4 }
              ],
              correctAnswer: 'b',
              explanation: 'The design thinking process has 5 stages: Empathize, Define, Ideate, Prototype, and Test.',
              order: 3
                }
              ],
              passingScore: 70,
          timeLimit: 10,
              isActive: true
        },
        lessons: [
          {
            id: 'lesson-1',
            title: 'What is Design Thinking?',
            duration: '5 mins',
            isCompleted: false,
            isCurrent: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            description: 'Introduction to design thinking methodology and its benefits.'
          },
          {
            id: 'lesson-2',
            title: 'The 5 Stages of Design Thinking',
            duration: '6 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            description: 'Learn the five stages: Empathize, Define, Ideate, Prototype, and Test.'
          },
          {
            id: 'lesson-3',
            title: 'Empathy in Design',
            duration: '4 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            description: 'Understand the importance of empathy in the design process.'
          },
          {
            id: 'lesson-4',
            title: 'Problem Definition',
            duration: '3 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            description: 'Learn how to define problems clearly and effectively.'
          },
          {
            id: 'lesson-5',
            title: 'Ideation Techniques',
            duration: '7 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            description: 'Master various ideation techniques like brainstorming and mind mapping.'
          },
          {
            id: 'lesson-6',
            title: 'Prototyping and Testing',
            duration: '8 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            description: 'Learn how to create prototypes and test your ideas effectively.'
          },
          {
            id: 'lesson-7',
            title: 'User Research Methods',
            duration: '6 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            description: 'Explore different user research methods and when to use them.'
          },
          {
            id: 'lesson-8',
            title: 'Design Thinking Tools',
            duration: '5 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            description: 'Discover useful tools and frameworks for design thinking.'
          }
        ]
      },
      {
        id: 'design-section-2',
        title: 'Advanced Design Thinking and Implementation',
        isExpanded: false,
        progress: { completed: 0, total: 4, duration: '20 mins' },
        quiz: {
          id: 'design-section-2-quiz',
          title: 'Advanced Design Thinking Quiz',
          description: 'Test your knowledge of advanced design thinking concepts and implementation',
          questions: [
            {
              id: 'dq4',
              quizId: 'design-section-2-quiz',
              questionText: 'What is the purpose of rapid prototyping in design thinking?',
              options: [
                { id: 'a', text: 'To create perfect final products', isCorrect: false, order: 1 },
                { id: 'b', text: 'To quickly test and validate ideas with users', isCorrect: true, order: 2 },
                { id: 'c', text: 'To save money on development', isCorrect: false, order: 3 },
                { id: 'd', text: 'To impress stakeholders', isCorrect: false, order: 4 }
              ],
              correctAnswer: 'b',
              explanation: 'Rapid prototyping allows you to quickly test and validate ideas with users before investing in full development.',
              order: 1
            },
            {
              id: 'dq5',
              quizId: 'design-section-2-quiz',
              questionText: 'What is the main goal of the "Test" phase in design thinking?',
              options: [
                { id: 'a', text: 'To create the final product', isCorrect: false, order: 1 },
                { id: 'b', text: 'To gather feedback and iterate on solutions', isCorrect: true, order: 2 },
                { id: 'c', text: 'To present to stakeholders', isCorrect: false, order: 3 },
                { id: 'd', text: 'To document the process', isCorrect: false, order: 4 }
              ],
              correctAnswer: 'b',
              explanation: 'The Test phase focuses on gathering feedback from users and iterating on solutions based on their input.',
              order: 2
            },
            {
              id: 'dq6',
              quizId: 'design-section-2-quiz',
              questionText: 'What is the benefit of involving users throughout the design thinking process?',
              options: [
                { id: 'a', text: 'To reduce development time', isCorrect: false, order: 1 },
                { id: 'b', text: 'To ensure solutions meet real user needs', isCorrect: true, order: 2 },
                { id: 'c', text: 'To avoid making decisions', isCorrect: false, order: 3 },
                { id: 'd', text: 'To increase project costs', isCorrect: false, order: 4 }
              ],
              correctAnswer: 'b',
              explanation: 'Involving users throughout the process ensures that solutions are designed to meet real user needs and problems.',
              order: 3
            }
          ],
          passingScore: 70,
          timeLimit: 10,
          isActive: true
        },
        quizCompleted: false,
        isUnlocked: false,
        lessons: [
          {
            id: 'lesson-9',
            title: 'Rapid Prototyping and Testing',
            duration: '5 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
            description: 'Learn how to create rapid prototypes and test them with users effectively.'
          },
          {
            id: 'lesson-10',
            title: 'Iterating Based on Feedback',
            duration: '5 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
            description: 'Master the art of iterating and improving solutions based on user feedback.'
          },
          {
            id: 'lesson-11',
            title: 'Implementing Design Thinking in Organizations',
            duration: '5 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            description: 'Learn how to implement design thinking methodologies in your organization.'
          },
          {
            id: 'lesson-12',
            title: 'Measuring Design Thinking Success',
            duration: '5 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
            description: 'Discover how to measure the success and impact of design thinking initiatives.'
          }
        ]
      }
    ]
  },
  'business-strategy-fundamentals': {
    id: '6',
    title: 'Business Strategy Fundamentals',
    slug: 'business-strategy-fundamentals',
    description: 'Master the fundamentals of business strategy and learn how to develop, implement, and execute strategic plans for business success.',
    shortDescription: 'Learn business strategy fundamentals for success',
    progress: 0,
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    instructor: {
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face',
      title: 'Business Strategy Consultant'
    },
    duration: '4h 20m',
    level: 'Intermediate',
    rating: 4.6,
    studentsCount: 9800,
    price: 249,
    originalPrice: 349,
    isEnrolled: false,
    completionPercentage: 0,
    totalLessons: 18,
    completedLessons: 0,
    sections: [
      {
        id: 'section-1',
        title: 'Strategic Planning Basics',
        isExpanded: true,
        progress: { completed: 0, total: 10, duration: '50 mins' },
            quiz: {
          id: 'business-section-1-quiz',
              title: 'Business Strategy Fundamentals Quiz',
          description: 'Test your understanding of business strategy concepts and planning',
              questions: [
                {
                  id: 'bq1',
              quizId: 'business-section-1-quiz',
                  questionText: 'What is the primary purpose of a business strategy?',
                  options: [
                    { id: 'a', text: 'To increase employee satisfaction', isCorrect: false, order: 1 },
                    { id: 'b', text: 'To achieve competitive advantage and organizational goals', isCorrect: true, order: 2 },
                    { id: 'c', text: 'To reduce operational costs', isCorrect: false, order: 3 },
                    { id: 'd', text: 'To improve product quality', isCorrect: false, order: 4 }
                  ],
                  correctAnswer: 'b',
                  explanation: 'Business strategy aims to achieve competitive advantage and help organizations reach their long-term goals.',
                  order: 1
                },
                {
                  id: 'bq2',
              quizId: 'business-section-1-quiz',
                  questionText: 'What characteristic should a good business strategy have?',
                  options: [
                { id: 'a', text: 'It should be rigid and unchanging', isCorrect: false, order: 1 },
                { id: 'b', text: 'It should be flexible and adaptable to changing market conditions', isCorrect: true, order: 2 },
                { id: 'c', text: 'It should focus only on short-term goals', isCorrect: false, order: 3 },
                { id: 'd', text: 'It should ignore market trends', isCorrect: false, order: 4 }
                  ],
              correctAnswer: 'b',
                  explanation: 'Effective strategies must be flexible enough to adapt to changing market conditions and opportunities.',
                  order: 2
                },
            {
              id: 'bq3',
              quizId: 'business-section-1-quiz',
              questionText: 'What does SWOT analysis stand for?',
              options: [
                { id: 'a', text: 'Strengths, Weaknesses, Opportunities, Threats', isCorrect: true, order: 1 },
                { id: 'b', text: 'Strategy, Workflow, Operations, Technology', isCorrect: false, order: 2 },
                { id: 'c', text: 'Sales, Workforce, Objectives, Targets', isCorrect: false, order: 3 },
                { id: 'd', text: 'Success, Wisdom, Organization, Training', isCorrect: false, order: 4 }
              ],
              correctAnswer: 'a',
              explanation: 'SWOT analysis evaluates Strengths, Weaknesses, Opportunities, and Threats to inform strategic planning.',
              order: 3
                }
              ],
              passingScore: 70,
          timeLimit: 10,
              isActive: true
        },
        lessons: [
          {
            id: 'lesson-1',
            title: 'What is Business Strategy?',
            duration: '4 mins',
            isCompleted: false,
            isCurrent: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            description: 'Introduction to business strategy and its importance in organizational success.'
          },
          {
            id: 'lesson-2',
            title: 'SWOT Analysis',
            duration: '5 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            description: 'Master SWOT analysis to assess your business strengths, weaknesses, opportunities, and threats.'
          },
          {
            id: 'lesson-3',
            title: 'Competitive Analysis',
            duration: '4 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            description: 'Learn how to analyze competitors and identify competitive advantages.'
          },
          {
            id: 'lesson-4',
            title: 'Market Positioning',
            duration: '5 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            description: 'Understand market positioning strategies and how to differentiate your business.'
          },
          {
            id: 'lesson-5',
            title: 'Strategic Goals Setting',
            duration: '4 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            description: 'Set clear, measurable strategic goals that align with your business vision.'
          },
          {
            id: 'lesson-6',
            title: 'Resource Allocation',
            duration: '6 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            description: 'Learn how to allocate resources effectively to achieve strategic objectives.'
          },
          {
            id: 'lesson-7',
            title: 'Risk Management',
            duration: '5 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            description: 'Identify and manage risks that could impact your business strategy.'
          },
          {
            id: 'lesson-8',
            title: 'Strategic Implementation',
            duration: '7 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            description: 'Learn how to implement and execute your business strategy effectively.'
          },
          {
            id: 'lesson-9',
            title: 'Performance Measurement',
            duration: '4 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            description: 'Establish KPIs and metrics to measure strategic performance.'
          },
          {
            id: 'lesson-10',
            title: 'Strategic Planning Tools',
            duration: '6 mins',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            description: 'Explore various tools and frameworks for strategic planning.'
          }
        ]
      },
      {
        id: 'business-section-2',
        title: 'Advanced Strategic Planning and Execution',
        isExpanded: false,
        progress: { completed: 0, total: 4, duration: '22 mins' },
        quiz: {
          id: 'business-section-2-quiz',
          title: 'Advanced Business Strategy Quiz',
          description: 'Test your knowledge of advanced strategic planning and execution',
          questions: [
            {
              id: 'bq4',
              quizId: 'business-section-2-quiz',
              questionText: 'What is the purpose of scenario planning in business strategy?',
              options: [
                { id: 'a', text: 'To predict the future accurately', isCorrect: false, order: 1 },
                { id: 'b', text: 'To prepare for multiple possible futures', isCorrect: true, order: 2 },
                { id: 'c', text: 'To eliminate all risks', isCorrect: false, order: 3 },
                { id: 'd', text: 'To reduce planning time', isCorrect: false, order: 4 }
              ],
              correctAnswer: 'b',
              explanation: 'Scenario planning helps organizations prepare for multiple possible futures and develop flexible strategies.',
              order: 1
            },
            {
              id: 'bq5',
              quizId: 'business-section-2-quiz',
              questionText: 'What is the key to successful strategy execution?',
              options: [
                { id: 'a', text: 'Having a perfect strategy', isCorrect: false, order: 1 },
                { id: 'b', text: 'Aligning people, processes, and systems with strategy', isCorrect: true, order: 2 },
                { id: 'c', text: 'Having unlimited resources', isCorrect: false, order: 3 },
                { id: 'd', text: 'Avoiding all changes', isCorrect: false, order: 4 }
              ],
              correctAnswer: 'b',
              explanation: 'Successful strategy execution requires aligning people, processes, and systems to support the strategic objectives.',
              order: 2
            },
            {
              id: 'bq6',
              quizId: 'business-section-2-quiz',
              questionText: 'What is the balanced scorecard approach to strategy?',
              options: [
                { id: 'a', text: 'Focusing only on financial metrics', isCorrect: false, order: 1 },
                { id: 'b', text: 'Balancing financial, customer, internal process, and learning perspectives', isCorrect: true, order: 2 },
                { id: 'c', text: 'Measuring only customer satisfaction', isCorrect: false, order: 3 },
                { id: 'd', text: 'Avoiding all measurements', isCorrect: false, order: 4 }
              ],
              correctAnswer: 'b',
              explanation: 'The balanced scorecard balances four perspectives: financial, customer, internal processes, and learning and growth.',
              order: 3
            }
          ],
          passingScore: 70,
          timeLimit: 10,
          isActive: true
        },
        quizCompleted: false,
        isUnlocked: false,
        lessons: [
          {
            id: 'lesson-11',
            title: 'Scenario Planning and Future Thinking',
            duration: '5 mins 30 sec',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            description: 'Learn scenario planning techniques to prepare for multiple possible futures.'
          },
          {
            id: 'lesson-12',
            title: 'Strategy Execution and Change Management',
            duration: '5 mins 45 sec',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            description: 'Master the art of executing strategy and managing organizational change.'
          },
          {
            id: 'lesson-13',
            title: 'Balanced Scorecard and Performance Management',
            duration: '5 mins 30 sec',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
            description: 'Implement balanced scorecard methodology for comprehensive performance management.'
          },
          {
            id: 'lesson-14',
            title: 'Strategic Leadership and Culture',
            duration: '5 mins 15 sec',
            isCompleted: false,
            isCurrent: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
            description: 'Build strategic leadership capabilities and create a culture that supports strategy execution.'
          }
        ]
      }
    ]
  }
}

// Helper function to get course by slug
const getCourseBySlug = (slug: string): Course | undefined => {
  return sampleCourses[slug]
}

const CoursePlayerPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState('overview')
  const [courseData, setCourseData] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [showNextLessonModal, setShowNextLessonModal] = useState(false)
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState<LessonQuizType | null>(null)
  const [currentSection, setCurrentSection] = useState<string | null>(null)

  // Helper function to find current lesson
  const findCurrentLesson = (course: Course): Lesson | null => {
    for (const section of course.sections) {
      for (const lesson of section.lessons) {
        if (lesson.isCurrent) {
          return lesson
        }
      }
    }
    return null
  }

  // Helper function to find next lesson
  const findNextLesson = (course: Course, currentLessonId: string): Lesson | null => {
    let foundCurrent = false
    for (const section of course.sections) {
      // Check if section is unlocked (first section is always unlocked)
      const isFirstSection = section.id.includes('section-1')
      const isSectionUnlocked = isFirstSection || section.isUnlocked
      
      if (!isSectionUnlocked) {
        // Skip this section if it's locked
        continue
      }
      
      for (const lesson of section.lessons) {
        if (foundCurrent && !lesson.isLocked) {
          return lesson
        }
        if (lesson.id === currentLessonId) {
          foundCurrent = true
        }
      }
    }
    return null
  }

  // Helper function to update lesson progress
  const updateLessonProgress = (lessonId: string, isCompleted: boolean) => {
    if (!courseData || !currentLesson) return
    console.log('DEBUG: updateLessonProgress called for lesson:', lessonId, 'completed:', isCompleted)
    console.log('DEBUG: Current lesson:', currentLesson.title, 'ID:', currentLesson.id)

    // Find the section containing the current lesson
    const currentSection = courseData.sections.find(section => 
      section.lessons.some(lesson => lesson.id === currentLesson.id)
    )
    
    if (!currentSection) {
      console.log('DEBUG: No current section found for current lesson:', currentLesson.id)
      return
    }

    console.log('DEBUG: Current section ID:', currentSection.id)

    const updatedSections = courseData.sections.map(section => {
      console.log('DEBUG: Processing section:', section.id)
      return {
        ...section,
        lessons: section.lessons.map(lesson => {
          console.log('DEBUG: Processing lesson:', lesson.id, 'in section:', section.id)
          // Only update the lesson if it's in the current section and matches the lessonId
          if (section.id === currentSection.id && lesson.id === lessonId) {
            console.log('DEBUG: Updating lesson:', lessonId, 'in section:', section.id, 'to completed:', isCompleted)
            return { ...lesson, isCompleted }
          }
          return lesson
        })
      }
    })

    // Calculate overall course progress
    const totalLessons = updatedSections.reduce((total, section) => total + section.lessons.length, 0)
    const completedLessons = updatedSections.reduce((completed, section) => 
      completed + section.lessons.filter(lesson => lesson.isCompleted).length, 0
    )
    const courseProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    // Update section progress - ONLY for the current section
    const updatedSectionsWithProgress = updatedSections.map(section => {
      // Only update progress for the current section
      if (section.id === currentSection.id) {
        const sectionCompleted = section.lessons.filter(lesson => lesson.isCompleted).length
        const sectionTotal = section.lessons.length
        
        console.log('DEBUG: Updating progress for current section:', section.id, 'completed:', sectionCompleted, 'total:', sectionTotal)
        
        return {
          ...section,
          progress: {
            ...section.progress,
            completed: sectionCompleted,
            total: sectionTotal
          }
        }
      }
      
      // For other sections, keep their progress unchanged
      return section
    })

    setCourseData({
      ...courseData,
      sections: updatedSectionsWithProgress,
      progress: courseProgress
    })
  }

  useEffect(() => {
    if (slug) {
      setLoading(true)
      console.log('Loading course with slug:', slug)
      // Simulate API call delay
      setTimeout(() => {
      const course = getCourseBySlug(slug)
        console.log('Found course:', course)
      if (course) {
        setCourseData(course)
          const current = findCurrentLesson(course)
          setCurrentLesson(current)
      }
        setLoading(false)
      }, 500)
    } else {
      setLoading(false)
    }
  }, [slug])

  const handleBackToCourses = () => {
    navigate('/student/course-list')
  }

  const handleLessonSelect = (lessonId: string, sectionId: string) => {
    if (!courseData) return
    console.log('DEBUG: handleLessonSelect called for lesson:', lessonId, 'section:', sectionId)

    // Find the section containing the lesson
    const targetSection = courseData.sections.find(section => section.id === sectionId)
    if (!targetSection) return

    // Check if this section is unlocked (first section is always unlocked)
    const currentSectionIndex = courseData.sections.findIndex(section => section.id === sectionId)
    const isFirstSection = currentSectionIndex === 0
    if (!isFirstSection && !targetSection.isUnlocked) {
      alert('Bạn phải hoàn thành quiz của section trước đó trước khi có thể xem section này!')
      return
    }

    // No need to check quiz completion when selecting lessons
    // Quiz completion check is only needed when selecting quiz

    // Update all lessons to set the selected one as current
    const updatedSections = courseData.sections.map(section => ({
      ...section,
      lessons: section.lessons.map(lesson => ({
        ...lesson,
        isCurrent: false // Reset all lessons first
      }))
    }))
    
    // Then set the selected lesson as current
    const targetSectionIndex = updatedSections.findIndex(section => section.id === sectionId)
    if (targetSectionIndex !== -1) {
      updatedSections[targetSectionIndex] = {
        ...updatedSections[targetSectionIndex],
        lessons: updatedSections[targetSectionIndex].lessons.map(lesson => ({
          ...lesson,
          isCurrent: lesson.id === lessonId
        }))
      }
    }

    const updatedCourse = {
      ...courseData,
      sections: updatedSections
    }

    setCourseData(updatedCourse)
    
    // Find and set the new current lesson
    const newCurrentLesson = findCurrentLesson(updatedCourse)
    setCurrentLesson(newCurrentLesson)
  }

  const handleVideoEnd = () => {
    console.log('DEBUG: handleVideoEnd called for lesson:', currentLesson?.title)
    if (!currentLesson || !courseData) return

    // Complete the lesson
    handleLessonCompletion()
  }

  const handleLessonCompletion = () => {
    if (!currentLesson || !courseData) return
    console.log('DEBUG: handleLessonCompletion called for lesson:', currentLesson.title)

    // Mark current lesson as completed
    updateLessonProgress(currentLesson.id, true)
    console.log('Marked lesson as completed:', currentLesson.title)

    // Find next lesson
    const next = findNextLesson(courseData, currentLesson.id)
    console.log('Next lesson found:', next?.title)
    if (next) {
      setNextLesson(next)
      setShowNextLessonModal(true)
    }
  }

  const handleContinueToNextLesson = () => {
    if (!nextLesson || !courseData) return

    // Set next lesson as current
    const updatedSections = courseData.sections.map(section => ({
      ...section,
      lessons: section.lessons.map(lesson => ({
        ...lesson,
        isCurrent: false // Reset all lessons first
      }))
    }))
    
    // Then set the next lesson as current
    const targetSectionIndex = updatedSections.findIndex(section => 
      section.lessons.some(lesson => lesson.id === nextLesson.id)
    )
    if (targetSectionIndex !== -1) {
      updatedSections[targetSectionIndex] = {
        ...updatedSections[targetSectionIndex],
        lessons: updatedSections[targetSectionIndex].lessons.map(lesson => ({
          ...lesson,
          isCurrent: lesson.id === nextLesson.id
        }))
      }
    }

    setCourseData({
      ...courseData,
      sections: updatedSections
    })

    setCurrentLesson(nextLesson)
    setShowNextLessonModal(false)
    setNextLesson(null)
  }

  const handleSkipNextLesson = () => {
    setShowNextLessonModal(false)
    setNextLesson(null)
  }

  const handleRewatchCurrentLesson = () => {
    if (!currentLesson || !courseData) return

    // Reset current lesson progress and restart video
    const updatedSections = courseData.sections.map(section => ({
      ...section,
      lessons: section.lessons.map(lesson => ({
        ...lesson,
        isCompleted: lesson.id === currentLesson.id ? false : lesson.isCompleted,
        isCurrent: lesson.id === currentLesson.id
      }))
    }))

    setCourseData({
      ...courseData,
      sections: updatedSections
    })

    // Close modal
    setShowNextLessonModal(false)
    setNextLesson(null)

    // Restart video from beginning after a short delay
    setTimeout(() => {
      const videoElement = document.querySelector('video')
      if (videoElement) {
        videoElement.currentTime = 0
        videoElement.play().catch(error => {
          console.error('Error restarting video:', error)
        })
      }
    }, 100)
  }

  const handlePreviousLesson = () => {
    if (!courseData || !currentLesson) return

    // Find current lesson index
    let currentSectionIndex = -1
    let currentLessonIndex = -1

    for (let i = 0; i < courseData.sections.length; i++) {
      const lessonIndex = courseData.sections[i].lessons.findIndex(
        lesson => lesson.id === currentLesson.id
      )
      if (lessonIndex !== -1) {
        currentSectionIndex = i
        currentLessonIndex = lessonIndex
        break
      }
    }

    if (currentSectionIndex === -1 || currentLessonIndex === -1) return

    // Find previous lesson
    let prevLesson = null
    let prevSectionIndex = currentSectionIndex
    let prevLessonIndex = currentLessonIndex - 1

    // Check if we need to go to previous section
    if (prevLessonIndex < 0) {
      prevSectionIndex = currentSectionIndex - 1
      if (prevSectionIndex >= 0) {
        prevLessonIndex = courseData.sections[prevSectionIndex].lessons.length - 1
      }
    }

    if (prevSectionIndex >= 0 && prevLessonIndex >= 0) {
      prevLesson = courseData.sections[prevSectionIndex].lessons[prevLessonIndex]
    }

    if (prevLesson) {
      // Update sections to set previous lesson as current
      const updatedSections = courseData.sections.map((section, sIndex) => ({
        ...section,
        lessons: section.lessons.map((lesson, lIndex) => ({
          ...lesson,
          isCurrent: sIndex === prevSectionIndex && lIndex === prevLessonIndex
        }))
      }))

      setCourseData({
        ...courseData,
        sections: updatedSections
      })

      setCurrentLesson(prevLesson)
    }
  }

  const handleNextLesson = () => {
    if (!courseData || !currentLesson) return

    // Find current lesson index
    let currentSectionIndex = -1
    let currentLessonIndex = -1

    for (let i = 0; i < courseData.sections.length; i++) {
      const lessonIndex = courseData.sections[i].lessons.findIndex(
        lesson => lesson.id === currentLesson.id
      )
      if (lessonIndex !== -1) {
        currentSectionIndex = i
        currentLessonIndex = lessonIndex
        break
      }
    }

    if (currentSectionIndex === -1 || currentLessonIndex === -1) return

    // Find next lesson
    let nextLesson = null
    let nextSectionIndex = currentSectionIndex
    let nextLessonIndex = currentLessonIndex + 1

    // Check if we need to go to next section
    if (nextLessonIndex >= courseData.sections[currentSectionIndex].lessons.length) {
      nextSectionIndex = currentSectionIndex + 1
      nextLessonIndex = 0
    }

    if (nextSectionIndex < courseData.sections.length && nextLessonIndex < courseData.sections[nextSectionIndex].lessons.length) {
      // Check if the next section is unlocked
      const nextSection = courseData.sections[nextSectionIndex]
      const isFirstSection = nextSection.id.includes('section-1')
      const isSectionUnlocked = isFirstSection || nextSection.isUnlocked
      
      if (isSectionUnlocked) {
        nextLesson = nextSection.lessons[nextLessonIndex]
      }
    }

    if (nextLesson) {
      // Update sections to set next lesson as current
      const updatedSections = courseData.sections.map((section, sIndex) => ({
        ...section,
        lessons: section.lessons.map((lesson, lIndex) => ({
          ...lesson,
          isCurrent: sIndex === nextSectionIndex && lIndex === nextLessonIndex
        }))
      }))

      setCourseData({
        ...courseData,
        sections: updatedSections
      })

      setCurrentLesson(nextLesson)
    }
  }

  // Helper function to check if previous/next lesson exists
  const hasPreviousLesson = () => {
    if (!courseData || !currentLesson) return false

    let currentSectionIndex = -1
    let currentLessonIndex = -1

    for (let i = 0; i < courseData.sections.length; i++) {
      const lessonIndex = courseData.sections[i].lessons.findIndex(
        lesson => lesson.id === currentLesson.id
      )
      if (lessonIndex !== -1) {
        currentSectionIndex = i
        currentLessonIndex = lessonIndex
        break
      }
    }

    if (currentSectionIndex === -1 || currentLessonIndex === -1) return false

    // Check if previous lesson exists
    if (currentLessonIndex > 0) return true
    if (currentSectionIndex > 0) {
      return courseData.sections[currentSectionIndex - 1].lessons.length > 0
    }
    return false
  }

  const hasNextLesson = () => {
    if (!courseData || !currentLesson) return false

    let currentSectionIndex = -1
    let currentLessonIndex = -1

    for (let i = 0; i < courseData.sections.length; i++) {
      const lessonIndex = courseData.sections[i].lessons.findIndex(
        lesson => lesson.id === currentLesson.id
      )
      if (lessonIndex !== -1) {
        currentSectionIndex = i
        currentLessonIndex = lessonIndex
        break
      }
    }

    if (currentSectionIndex === -1 || currentLessonIndex === -1) return false

    // Check if next lesson exists
    if (currentLessonIndex < courseData.sections[currentSectionIndex].lessons.length - 1) return true
    if (currentSectionIndex < courseData.sections.length - 1) {
      return courseData.sections[currentSectionIndex + 1].lessons.length > 0
    }
    return false
  }

  const handleToggleSection = (sectionId: string) => {
    if (!courseData) return
    
    const updatedSections = courseData.sections.map(section => 
      section.id === sectionId 
        ? { ...section, isExpanded: !section.isExpanded }
        : section
    )
    
    setCourseData({
      ...courseData,
      sections: updatedSections
    })
  }

  const handleToggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  const handleCloseUserMenu = () => {
    setIsUserMenuOpen(false)
  }

  const handleQuizComplete = (result: QuizResult) => {
    console.log('Quiz completed:', result, 'for section:', currentSection)
    
    // Mark the quiz as completed for the current section only if passed
    if (currentSection && courseData && result.attempt.passed) {
      const currentSectionIndex = courseData.sections.findIndex(section => section.id === currentSection)
      
      const updatedSections = courseData.sections.map((section, index) => {
        if (section.id === currentSection) {
          return { ...section, quizCompleted: true }
        }
        // Unlock the next section if this quiz is completed
        if (index === currentSectionIndex + 1) {
          return { ...section, isUnlocked: true }
        }
        return section
      })
      
      const updatedCourse = {
        ...courseData,
        sections: updatedSections
      }
      
      setCourseData(updatedCourse)
    }
    
    setShowQuiz(false)
    setCurrentQuiz(null)
    setCurrentSection(null)
  }


  const handleQuizSkip = () => {
    console.log('Skipping quiz')
    setShowQuiz(false)
    setCurrentQuiz(null)
    setCurrentSection(null)
    
    // Proceed to next lesson
    handleLessonCompletion()
  }

  const handleQuizSelect = (_quizId: string, sectionId: string) => {
    if (!courseData) return

    // Find the quiz in the section
    const section = courseData.sections.find(s => s.id === sectionId)
    if (!section?.quiz) return

    // Check if all lessons in the section are completed
    const allLessonsCompleted = section.lessons.every(lesson => lesson.isCompleted)
    if (!allLessonsCompleted) {
      alert('Bạn phải hoàn thành tất cả lessons trong section này trước khi có thể chơi quiz!')
      return
    }

    console.log('Selected quiz:', section.quiz.title, 'for section:', sectionId)
    setCurrentQuiz(section.quiz as LessonQuizType)
    setCurrentSection(sectionId)
    setShowQuiz(true)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isUserMenuOpen && !target.closest('.user-dropdown-container')) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'prerequisites', label: 'Prerequisites & FAQs' },
    { id: 'noticeboard', label: 'Noticeboard' },
    { id: 'course-info', label: 'Course Info' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    )
  }

  if (!courseData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
          <p className="text-sm text-gray-500 mb-4">Slug: {slug}</p>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Available courses:</p>
            <div className="space-y-1">
              {Object.keys(sampleCourses).map((courseSlug) => (
                <div key={courseSlug} className="text-sm text-blue-600">
                  <a href={`/student/course-player/${courseSlug}`} className="hover:underline">
                    {courseSlug}
                  </a>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={handleBackToCourses}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Fixed Sidebar */}
      <div className={`fixed left-0 top-0 h-full z-30 transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'w-16' : 'w-80'
      }`}>
        <CoursePlayerSidebar
          courseTitle={courseData.title}
          sections={courseData.sections}
          onBackToCourses={handleBackToCourses}
          onLessonSelect={handleLessonSelect}
          onQuizSelect={handleQuizSelect}
          onToggleSection={handleToggleSection}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Main Content with Fixed Header */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'ml-16' : 'ml-80'
      }`}>
        {/* Fixed Header */}
        <header className={`fixed top-0 right-0 bg-gray-900 text-white px-6 py-4 z-20 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'left-16' : 'left-80'
        }`}>
          <div className="flex items-center justify-between">
            {/* Left Side - Course Progress */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h2 className="text-lg font-semibold text-white tracking-wide">
                  COURSE PROGRESS
                </h2>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-64 bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${courseData.progress}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-white">{courseData.progress}%</span>
              </div>
            </div>

            {/* Right Side - Controls */}
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md transition-colors">
                <Share className="w-4 h-4" />
                <span className="text-sm">Share</span>
              </button>

              {/* Currency */}
              <button className="inline-flex items-center text-sm text-gray-300 hover:text-white">
                USD $
                <svg viewBox="0 0 20 20" className="w-4 h-4 ml-1 text-gray-400">
                  <path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>

              {/* Language */}
              <button className="inline-flex items-center text-sm text-gray-300 hover:text-white">
                <span className="inline-flex items-center justify-center w-6 h-4 mr-1">
                  <img src="https://flagcdn.com/w20/gb.png" alt="EN" className="w-5 h-3.5" />
                </span>
                En
                <svg viewBox="0 0 20 20" className="w-4 h-4 ml-1 text-gray-400">
                  <path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>

              {/* Shopping Cart */}
              <button className="relative p-2 text-gray-300 hover:text-white transition-colors">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  2
                </span>
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-gray-300 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </button>

              {/* Chat */}
              <button className="p-2 text-gray-300 hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </button>

              {/* User Profile Dropdown */}
              <div className="relative user-dropdown-container">
                <button
                  onClick={handleToggleUserMenu}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white"
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    <img 
                      src="/media/students/sarah-chapman.jpg" 
                      alt="User"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        const nextElement = e.currentTarget.nextElementSibling as HTMLElement
                        if (nextElement) {
                          nextElement.style.display = 'flex'
                        }
                      }}
                    />
                    <div className="w-full h-full bg-emerald-100 rounded-full flex items-center justify-center" style={{display: 'none'}}>
                      <span className="text-emerald-600 font-semibold text-sm">
                        U
                      </span>
                    </div>
                  </div>
                  <svg viewBox="0 0 20 20" className="w-4 h-4 text-gray-400">
                    <path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>

                <UserProfileDropdown 
                  isOpen={isUserMenuOpen} 
                  onClose={handleCloseUserMenu} 
                />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 pt-20 overflow-y-auto">
          <div className={`transition-all duration-300 ${
            isSidebarCollapsed ? 'p-4' : 'p-6'
          }`}>
            {showQuiz && currentQuiz ? (
              <LessonQuizComponent
                quiz={currentQuiz}
                onComplete={handleQuizComplete}
                onSkip={handleQuizSkip}
                isRequired={false}
              />
            ) : (
              <CourseVideoPlayer
                videoUrl={currentLesson?.videoUrl || courseData.videoUrl || ""}
                thumbnail={courseData.thumbnail}
                title={currentLesson?.title || courseData.title}
                instructor={courseData.instructor}
                onVideoEnd={handleVideoEnd}
                onPreviousLesson={handlePreviousLesson}
                onNextLesson={handleNextLesson}
                hasPreviousLesson={hasPreviousLesson()}
                hasNextLesson={hasNextLesson()}
                isSidebarCollapsed={isSidebarCollapsed}
              />
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white border-t border-gray-200">
            <div className={`transition-all duration-300 ${
              isSidebarCollapsed ? 'px-4' : 'px-6'
            }`}>
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className={`bg-white min-h-32 transition-all duration-300 ${
            isSidebarCollapsed ? 'p-4' : 'p-6'
          }`}>
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Course Overview</h3>
                <p className="text-gray-600 mb-4">{courseData.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Duration:</span>
                    <p className="text-gray-600">{courseData.duration}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Level:</span>
                    <p className="text-gray-600">{courseData.level}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Lessons:</span>
                    <p className="text-gray-600">{courseData.totalLessons}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Students:</span>
                    <p className="text-gray-600">{courseData.studentsCount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'prerequisites' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Prerequisites & FAQs</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Prerequisites</h4>
                    <p className="text-gray-600">No prior experience required. Just bring your ambition and willingness to learn!</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Frequently Asked Questions</h4>
                    <div className="space-y-2">
                      <div className="border-l-4 border-green-500 pl-4">
                        <p className="font-medium text-gray-900">How long do I have access to the course?</p>
                        <p className="text-gray-600 text-sm">You have lifetime access to this course once enrolled.</p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4">
                        <p className="font-medium text-gray-900">Can I get a refund if I'm not satisfied?</p>
                        <p className="text-gray-600 text-sm">Yes, we offer a 30-day money-back guarantee.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'noticeboard' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Noticeboard</h3>
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-medium text-blue-900">New Content Added</span>
                    </div>
                    <p className="text-blue-800 text-sm">We've added new lessons to Section 2. Check them out!</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-900">Course Update</span>
                    </div>
                    <p className="text-green-800 text-sm">The course has been updated with the latest best practices.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'course-info' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Course Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-gray-900">Instructor:</span>
                      <p className="text-gray-600">{courseData.instructor.name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Rating:</span>
                      <p className="text-gray-600">{courseData.rating}/5.0 ⭐</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Duration:</span>
                      <p className="text-gray-600">{courseData.duration}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Level:</span>
                      <p className="text-gray-600">{courseData.level}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Total Lessons:</span>
                      <p className="text-gray-600">{courseData.totalLessons}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Students Enrolled:</span>
                      <p className="text-gray-600">{courseData.studentsCount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Instructor Bio:</span>
                    <p className="text-gray-600 mt-1">{courseData.instructor.title}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Next Lesson Modal */}
      {showNextLessonModal && nextLesson && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-2xl flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 border border-white/20">
            <div className="text-center">
              {/* Success Icon with Enhanced Animation */}
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-full animate-ping opacity-20"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-xl">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              {/* Title */}
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                🎉 Lesson Completed!
              </h3>
              
              <p className="text-gray-600 mb-8 text-lg font-medium">
                Excellent work! What would you like to do next?
              </p>
              
              {/* Next Lesson Preview */}
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 border border-blue-200/50 shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-bold text-gray-900 mb-2 text-lg">
                      {nextLesson.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      {nextLesson.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 font-medium">Duration: {nextLesson.duration}</span>
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-sm font-semibold shadow-sm">
                        Next Lesson
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-4">
                {/* Rewatch Current Lesson */}
                <button
                  onClick={handleRewatchCurrentLesson}
                  className="group w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg flex items-center justify-center space-x-3 border border-purple-400/20"
                >
                  <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="font-semibold text-lg">Rewatch This Lesson</span>
                </button>
                
                {/* Continue to Next Lesson */}
                <button
                  onClick={handleContinueToNextLesson}
                  className="group w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg flex items-center justify-center space-x-3 border border-green-400/20"
                >
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span className="font-semibold text-lg">Continue to Next Lesson</span>
                </button>
                
                {/* Maybe Later */}
                <button
                  onClick={handleSkipNextLesson}
                  className="w-full px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-2xl hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-all duration-300 font-medium"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default CoursePlayerPage