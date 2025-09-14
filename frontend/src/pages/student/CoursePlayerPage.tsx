import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import CoursePlayerSidebar from '../../components/student/coursePlayer/CoursePlayerSidebar'
import CourseVideoPlayer from '../../components/student/coursePlayer/CourseVideoPlayer'
import { 
  Share, 
  ChevronDown, 
  Bell
} from 'lucide-react'

interface Lesson {
  id: string
  title: string
  duration: string
  isCompleted: boolean
  isCurrent: boolean
  isLocked?: boolean
  videoUrl?: string
  description?: string
}

interface Section {
  id: string
  title: string
  isExpanded: boolean
  progress: { completed: number; total: number; duration: string }
  lessons: Lesson[]
}

interface Course {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  progress: number
  thumbnail: string
  videoUrl?: string
  instructor: {
    name: string
    avatar: string
    title?: string
  }
  sections: Section[]
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  rating: number
  studentsCount: number
  price: number
  originalPrice?: number
  isEnrolled: boolean
  lastAccessed?: string
  completionPercentage: number
  totalLessons: number
  completedLessons: number
}

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
        id: 'section-2',
        title: 'Setting and Achieving Your Goals',
        isExpanded: false,
        progress: { completed: 0, total: 3, duration: '18 mins 30 sec' },
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
    if (!courseData) return

    const updatedSections = courseData.sections.map(section => ({
      ...section,
      lessons: section.lessons.map(lesson => {
        if (lesson.id === lessonId) {
          return { ...lesson, isCompleted }
        }
        return lesson
      })
    }))

    // Calculate overall course progress
    const totalLessons = updatedSections.reduce((total, section) => total + section.lessons.length, 0)
    const completedLessons = updatedSections.reduce((completed, section) => 
      completed + section.lessons.filter(lesson => lesson.isCompleted).length, 0
    )
    const courseProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    // Update section progress
    const updatedSectionsWithProgress = updatedSections.map(section => {
      const sectionCompleted = section.lessons.filter(lesson => lesson.isCompleted).length
      const sectionTotal = section.lessons.length
      
      return {
        ...section,
        progress: {
          ...section.progress,
          completed: sectionCompleted,
          total: sectionTotal
        }
      }
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

  const handleLessonSelect = (lessonId: string, _sectionId: string) => {
    if (!courseData) return

    // Update all lessons to set the selected one as current
    const updatedSections = courseData.sections.map(section => ({
      ...section,
      lessons: section.lessons.map(lesson => ({
        ...lesson,
        isCurrent: lesson.id === lessonId
      }))
    }))

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
    console.log('Video ended for lesson:', currentLesson?.title)
    if (!currentLesson || !courseData) return

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
        isCurrent: lesson.id === nextLesson.id
      }))
    }))

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
      nextLesson = courseData.sections[nextSectionIndex].lessons[nextLessonIndex]
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

              <div className="flex items-center space-x-1 text-sm">
                <span>USD $</span>
                <ChevronDown className="w-3 h-3" />
              </div>

              <div className="flex items-center space-x-1 text-sm">
                <img src="https://flagcdn.com/w20/us.png" alt="EN" className="w-4 h-3" />
                <span>En</span>
                <ChevronDown className="w-3 h-3" />
              </div>

              <Bell className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer" />

              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" 
                  alt="User" 
                  className="w-full h-full object-cover" 
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
