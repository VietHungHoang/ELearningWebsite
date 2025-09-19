import type { QuizQuestion } from '../types/quiz'

// Mock course data used by CoursePlayerPage. Replace with real API call.
export const courseSample = {
  id: 'course-1',
  title: 'Time Management Mastery: Boost Your Productivity',
  subtitle: 'Master the art of time management to maximize productivity and achieve goals',
  price: '$29',
  originalPrice: '$59',
  discount: 50,
  videosCount: 27,
  totalDuration: '23 mins : 56 sec',
  lessonsCount: 27,
  language: 'English',
  level: 'Intermediate',
  enrolments: 2,
  views: 3492,
  lastUpdated: 'Sep 09, 2025',
  progressPct: 0,
  prerequisites: ['Basic computer skills', 'Motivation to improve productivity'],
  faqs: [
    { q: 'Do I need prior time management experience?', a: 'No, this course starts from fundamentals and builds up.' },
    { q: 'Can I access the materials offline?', a: 'Videos are streamed. Transcripts and PDFs are downloadable.' },
  ],
  description:
    "In today’s demanding world, mastering time management is a critical skill that can greatly enhance both your personal and professional life. This course equips you with essential tools and techniques to maximize productivity, manage time effectively, and stay focused on what truly matters. You will learn how to prioritize tasks, set achievable goals, and create effective schedules that align with your personal and professional objectives. Through a combination of video lectures, practical exercises, and real-world examples, you will gain the skills and knowledge needed to take control of your time and achieve your goals.",
  learningOutcomes: [
    'Prioritize tasks and set achievable goals',
    'Create effective schedules and routines',
    'Overcome procrastination and stay focused',
  ],
  instructor: {
    id: 'inst-1',
    name: 'Antony Clara',
    avatar: '/media/instructors/Antony%20Shao.png',
    verified: true,
    languages: ['English'],
    stats: { students: 22, courses: 4 },
    bio: "Passionate tutor helping students unlock their full potential through customized learning.",
  },
  reviews: [
    { name: 'Steven', avatar: '/media/avatars/Steven%20Ford.png', text: 'Steven is an outstanding tutor! Clear explanations and engaging sessions.' },
  ],
  chapters: [
    {
      id: 'ch-1',
      title: '1. Introduction to Design',
      lessons: [
        { id: 'l-1', title: 'Welcome to the Design Class', duration: '15 sec', type: 'video', videoSrc: '/media/homepage/tutor-video-1.mp4', poster: '/media/homepage/homepage-laptop.png' },
        { id: 'l-2', title: 'Tools Introduction', duration: '15 sec', type: 'video', videoSrc: '/media/homepage/tutor-video-2.mp4', poster: '/media/homepage/homepage-laptop.png' },
        { id: 'l-3', title: 'HTML5 Certification', duration: '1 sec', type: 'article', videoSrc: '/media/homepage/tutor-video-3.mp4', poster: '/media/homepage/homepage-laptop.png' },
      ],
    },
    {
      id: 'ch-2',
      title: '2. Certified HTML5',
      lessons: [
        { id: 'l-4', title: 'Program Information', duration: '2:35', type: 'video', videoSrc: '/media/homepage/tutor-video-4.mp4', poster: '/media/homepage/homepage-laptop.png' },
        { id: 'l-5', title: 'Your Development Toolbox', duration: '3:35', type: 'video', videoSrc: '/media/homepage/tutor-video-1.mp4', poster: '/media/homepage/homepage-laptop.png' },
      ],
    },
  ],
};

export interface Course {
  id: number
  title: string
  tagline: string
  rating: number
  reviews: number
  lastUpdated: string
  language: string
  enrolledStudents: number
  totalViews: number
  videoThumbnail: string
  videoDuration: string
  price: number
  originalPrice?: number
  discount?: number
  description: string
  outcomes: string[]
  curriculum: Chapter[]
  prerequisites: string[]
  faqs: FAQ[]
  tags: string[]
  instructor: {
    id: number
    name: string
    avatar: string
    isVerified: boolean
    activeStudents: number
    courses: number
    languages: string[]
    socialProfiles: { platform: string; url: string }[]
  }
}

export interface Chapter {
  id: number
  title: string
  lectures: number
  duration: string
  lessons: Lesson[]
}

export interface Lesson {
  id: number
  title: string
  duration: string
  type: 'video' | 'pdf' | 'quiz'
  isPreview: boolean
  videoUrl?: string
  description?: string
  quiz?: {
    id: string
    title: string
    description?: string
    questions: QuizQuestion[]
    passingScore: number
    maxAttempts: number
    timeLimit?: number
    isRequired: boolean
    isActive: boolean
  }
}

export interface FAQ {
  id: number
  question: string
  answer: string
}

export interface Review {
  id: number
  reviewerName: string
  reviewerAvatar: string
  rating: number
  date: string
  review: string
}

export const courseData: Course = {
  id: 1,
  title: "Time Management Mastery: Boost Your Productivity",
  tagline: "Master the Art of Time Management to Maximize Productivity and Achieve Your Goals",
  rating: 5.0,
  reviews: 6,
  lastUpdated: "Sep 08, 2020",
  language: "English",
  enrolledStudents: 2,
  totalViews: 3482,
  videoThumbnail: "/media/courses/time-management-video.jpg",
  videoDuration: "23 mins: 56 sec",
  price: 132.00,
  originalPrice: 160.00,
  discount: 18,
  description: "In today's demanding world, mastering time management is a critical skill that can greatly enhance both your personal and professional life. This course equips you with essential tools and techniques to maximize productivity, manage time effectively, and stay focused on what truly matters. You will learn how to prioritize tasks, set achievable goals, and create effective schedules that align with your objectives. Through practical exercises and real-world examples, you'll develop the skills needed to eliminate time-wasting activities and focus on high-impact work. The course covers various time management methodologies, including the Pomodoro Technique, Eisenhower Matrix, and Getting Things Done (GTD) system. By the end of this course, you'll have a comprehensive toolkit for managing your time more effectively and achieving greater success in all areas of your life.",
  outcomes: [
    "Prepare for industry Certification exam",
    "Hours and hours of Video instruction",
    "Over 15 Engaging Lab Exercises",
    "Server Side Development with PHP",
    "Leverage Time Saving Tools",
    "Learn Database Development with mySQL",
    "Set and Achieve Goals",
    "Enhance Focus and Concentration",
    "Prepare for Industry Certification Exam",
    "All Free Tools",
    "Create Effective Schedules",
    "Earn Certification that is Proof of your Competence"
  ],
  curriculum: [
    {
      id: 1,
      title: "Introduction to Time Management",
      lectures: 3,
      duration: "1 min: 46 sec",
      lessons: [
        { 
          id: 1, 
          title: "Welcome to the Course", 
          duration: "0:45", 
          type: "video", 
          isPreview: true,
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          description: "Introduction to the course and what you'll learn",
          quiz: {
            id: "quiz-1",
            title: "Introduction Quiz",
            description: "Test your understanding of the course introduction",
            questions: [
              {
                id: "q1",
                quizId: "quiz-1",
                questionText: "What is the main goal of this time management course?",
                questionType: "multiple_choice",
                points: 10,
                options: [
                  { id: "a", text: "To learn basic computer skills", isCorrect: false, order: 1 },
                  { id: "b", text: "To maximize productivity and achieve goals", isCorrect: true, order: 2 },
                  { id: "c", text: "To learn cooking techniques", isCorrect: false, order: 3 },
                  { id: "d", text: "To become a professional athlete", isCorrect: false, order: 4 }
                ],
                correctAnswer: "b",
                explanation: "The course focuses on time management to boost productivity and help you achieve your goals.",
                order: 1
              },
              {
                id: "q2",
                quizId: "quiz-1",
                questionText: "Time management is only important for work tasks.",
                questionType: "true_false",
                points: 5,
                correctAnswer: "false",
                explanation: "Time management is important for both personal and professional life.",
                order: 2
              }
            ],
            passingScore: 70,
            maxAttempts: 3,
            timeLimit: 5,
            isRequired: true,
            isActive: true
          }
        },
        { 
          id: 2, 
          title: "What is Time Management?", 
          duration: "0:32", 
          type: "video", 
          isPreview: false,
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          description: "Understanding the fundamentals of time management",
          quiz: {
            id: "quiz-2",
            title: "Time Management Fundamentals Quiz",
            description: "Test your understanding of basic time management concepts",
            questions: [
              {
                id: "q3",
                quizId: "quiz-2",
                questionText: "What is the primary purpose of time management?",
                questionType: "multiple_choice",
                points: 10,
                options: [
                  { id: "a", text: "To work longer hours", isCorrect: false, order: 1 },
                  { id: "b", text: "To accomplish more in less time", isCorrect: true, order: 2 },
                  { id: "c", text: "To avoid all deadlines", isCorrect: false, order: 3 },
                  { id: "d", text: "To eliminate all breaks", isCorrect: false, order: 4 }
                ],
                correctAnswer: "b",
                explanation: "Time management helps you accomplish more in less time by organizing and prioritizing tasks effectively.",
                order: 1
              },
              {
                id: "q4",
                quizId: "quiz-2",
                questionText: "Time management only applies to work-related tasks.",
                questionType: "true_false",
                points: 5,
                correctAnswer: "false",
                explanation: "Time management applies to all aspects of life including personal, professional, and leisure activities.",
                order: 2
              },
              {
                id: "q5",
                quizId: "quiz-2",
                questionText: "What does the term 'time blocking' mean?",
                questionType: "fill_blank",
                points: 10,
                correctAnswer: "scheduling specific time slots for specific activities",
                explanation: "Time blocking is the practice of scheduling specific time slots for specific activities or tasks.",
                order: 3
              }
            ],
            passingScore: 75,
            maxAttempts: 2,
            timeLimit: 8,
            isRequired: true,
            isActive: true
          }
        },
        { 
          id: 3, 
          title: "Course Overview PDF", 
          duration: "2 min", 
          type: "pdf", 
          isPreview: false 
        }
      ]
    },
    {
      id: 2,
      title: "Fundamental Principles",
      lectures: 4,
      duration: "8 min: 12 sec",
      lessons: [
        { 
          id: 4, 
          title: "The Time Management Matrix", 
          duration: "2:15", 
          type: "video", 
          isPreview: false,
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          description: "Learn about the Eisenhower Matrix for task prioritization",
          quiz: {
            id: "quiz-3",
            title: "Time Management Matrix Quiz",
            description: "Test your knowledge of the Eisenhower Matrix and task prioritization",
            questions: [
              {
                id: "q6",
                quizId: "quiz-3",
                questionText: "In the Eisenhower Matrix, which quadrant contains tasks that are both urgent and important?",
                questionType: "multiple_choice",
                points: 15,
                options: [
                  { id: "a", text: "Quadrant 1", isCorrect: true, order: 1 },
                  { id: "b", text: "Quadrant 2", isCorrect: false, order: 2 },
                  { id: "c", text: "Quadrant 3", isCorrect: false, order: 3 },
                  { id: "d", text: "Quadrant 4", isCorrect: false, order: 4 }
                ],
                correctAnswer: "a",
                explanation: "Quadrant 1 contains tasks that are both urgent and important - these should be done immediately.",
                order: 1
              },
              {
                id: "q7",
                quizId: "quiz-3",
                questionText: "Tasks in Quadrant 2 (Important but not urgent) should be scheduled for later.",
                questionType: "true_false",
                points: 10,
                correctAnswer: "false",
                explanation: "Quadrant 2 tasks should be scheduled and given priority to prevent them from becoming urgent.",
                order: 2
              },
              {
                id: "q8",
                quizId: "quiz-3",
                questionText: "What should you do with tasks in Quadrant 4 (neither urgent nor important)?",
                questionType: "short_answer",
                points: 15,
                correctAnswer: "eliminate or delegate",
                explanation: "Tasks in Quadrant 4 should be eliminated or delegated as they don't add value.",
                order: 3
              }
            ],
            passingScore: 80,
            maxAttempts: 3,
            timeLimit: 10,
            isRequired: true,
            isActive: true
          }
        },
        { 
          id: 5, 
          title: "Setting SMART Goals", 
          duration: "2:30", 
          type: "video", 
          isPreview: false,
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          description: "Master the art of setting Specific, Measurable, Achievable, Relevant, and Time-bound goals",
          quiz: {
            id: "quiz-4",
            title: "SMART Goals Quiz",
            description: "Test your understanding of SMART goal setting principles",
            questions: [
              {
                id: "q9",
                quizId: "quiz-4",
                questionText: "What does the 'S' in SMART goals stand for?",
                questionType: "multiple_choice",
                points: 10,
                options: [
                  { id: "a", text: "Simple", isCorrect: false, order: 1 },
                  { id: "b", text: "Specific", isCorrect: true, order: 2 },
                  { id: "c", text: "Short", isCorrect: false, order: 3 },
                  { id: "d", text: "Structured", isCorrect: false, order: 4 }
                ],
                correctAnswer: "b",
                explanation: "The 'S' in SMART stands for Specific - goals should be clear and well-defined.",
                order: 1
              },
              {
                id: "q10",
                quizId: "quiz-4",
                questionText: "A good goal should be measurable and have a deadline.",
                questionType: "true_false",
                points: 8,
                correctAnswer: "true",
                explanation: "Yes, measurable goals with deadlines help track progress and maintain motivation.",
                order: 2
              },
              {
                id: "q11",
                quizId: "quiz-4",
                questionText: "Which of the following is an example of a SMART goal?",
                questionType: "multiple_choice",
                points: 12,
                options: [
                  { id: "a", text: "I want to be successful", isCorrect: false, order: 1 },
                  { id: "b", text: "I will complete 5 online courses by December 31st", isCorrect: true, order: 2 },
                  { id: "c", text: "I will try to exercise more", isCorrect: false, order: 3 },
                  { id: "d", text: "I want to make more money", isCorrect: false, order: 4 }
                ],
                correctAnswer: "b",
                explanation: "This goal is Specific (5 courses), Measurable (countable), Achievable, Relevant, and Time-bound (by December 31st).",
                order: 3
              }
            ],
            passingScore: 70,
            maxAttempts: 2,
            timeLimit: 7,
            isRequired: true,
            isActive: true
          }
        },
        { 
          id: 6, 
          title: "Priority vs Urgency", 
          duration: "2:12", 
          type: "video", 
          isPreview: false,
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
          description: "Understand the difference between urgent and important tasks",
          quiz: {
            id: "quiz-5",
            title: "Priority vs Urgency Quiz",
            description: "Test your ability to distinguish between urgent and important tasks",
            questions: [
              {
                id: "q12",
                quizId: "quiz-5",
                questionText: "An urgent task is always more important than a non-urgent task.",
                questionType: "true_false",
                points: 10,
                correctAnswer: "false",
                explanation: "Urgency and importance are different concepts. Important tasks may not be urgent, but they should still be prioritized.",
                order: 1
              },
              {
                id: "q13",
                quizId: "quiz-5",
                questionText: "What characterizes an urgent task?",
                questionType: "multiple_choice",
                points: 12,
                options: [
                  { id: "a", text: "It has a deadline approaching", isCorrect: true, order: 1 },
                  { id: "b", text: "It requires a lot of time", isCorrect: false, order: 2 },
                  { id: "c", text: "It's difficult to complete", isCorrect: false, order: 3 },
                  { id: "d", text: "It's personally meaningful", isCorrect: false, order: 4 }
                ],
                correctAnswer: "a",
                explanation: "Urgent tasks are characterized by approaching deadlines or immediate attention requirements.",
                order: 2
              },
              {
                id: "q14",
                quizId: "quiz-5",
                questionText: "Which type of task should you focus on to prevent future crises?",
                questionType: "fill_blank",
                points: 15,
                correctAnswer: "important but not urgent",
                explanation: "Important but not urgent tasks help prevent future crises and should be prioritized.",
                order: 3
              }
            ],
            passingScore: 75,
            maxAttempts: 2,
            timeLimit: 6,
            isRequired: true,
            isActive: true
          }
        },
        { 
          id: 7, 
          title: "Exercise: Goal Setting", 
          duration: "1:15", 
          type: "quiz", 
          isPreview: false,
          quiz: {
            id: "quiz-6",
            title: "Goal Setting Practice Quiz",
            description: "Apply what you've learned about SMART goals and prioritization",
            questions: [
              {
                id: "q15",
                quizId: "quiz-6",
                questionText: "Which of the following best describes a well-written goal?",
                questionType: "multiple_choice",
                points: 20,
                options: [
                  { id: "a", text: "I want to be better at my job", isCorrect: false, order: 1 },
                  { id: "b", text: "I will improve my presentation skills by completing a public speaking course and delivering 3 presentations by March 31st", isCorrect: true, order: 2 },
                  { id: "c", text: "I will try to work harder", isCorrect: false, order: 3 },
                  { id: "d", text: "I want to make more friends", isCorrect: false, order: 4 }
                ],
                correctAnswer: "b",
                explanation: "This goal is specific, measurable, achievable, relevant, and time-bound - perfect SMART goal example.",
                order: 1
              },
              {
                id: "q16",
                quizId: "quiz-6",
                questionText: "When prioritizing tasks, you should always complete urgent tasks first.",
                questionType: "true_false",
                points: 15,
                correctAnswer: "false",
                explanation: "While urgent tasks need attention, important tasks should be prioritized to prevent them from becoming urgent.",
                order: 2
              }
            ],
            passingScore: 85,
            maxAttempts: 3,
            timeLimit: 5,
            isRequired: true,
            isActive: true
          }
        }
      ]
    },
    {
      id: 3,
      title: "Advanced Techniques",
      lectures: 5,
      duration: "12 min: 8 sec",
      lessons: [
        { 
          id: 8, 
          title: "The Pomodoro Technique", 
          duration: "3:20", 
          type: "video", 
          isPreview: false,
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
          description: "Master the Pomodoro Technique for focused work sessions",
          quiz: {
            id: "quiz-7",
            title: "Pomodoro Technique Quiz",
            description: "Test your understanding of the Pomodoro Technique and its benefits",
            questions: [
              {
                id: "q17",
                quizId: "quiz-7",
                questionText: "How long is a typical Pomodoro work session?",
                questionType: "multiple_choice",
                points: 10,
                options: [
                  { id: "a", text: "15 minutes", isCorrect: false, order: 1 },
                  { id: "b", text: "25 minutes", isCorrect: true, order: 2 },
                  { id: "c", text: "45 minutes", isCorrect: false, order: 3 },
                  { id: "d", text: "60 minutes", isCorrect: false, order: 4 }
                ],
                correctAnswer: "b",
                explanation: "A typical Pomodoro session is 25 minutes of focused work followed by a 5-minute break.",
                order: 1
              },
              {
                id: "q18",
                quizId: "quiz-7",
                questionText: "After completing 4 Pomodoros, you should take a longer break.",
                questionType: "true_false",
                points: 8,
                correctAnswer: "true",
                explanation: "After 4 Pomodoros, take a longer break (15-30 minutes) to recharge completely.",
                order: 2
              }
            ],
            passingScore: 75,
            maxAttempts: 2,
            timeLimit: 8,
            isRequired: true,
            isActive: true
          }
        },
        { id: 9, title: "Getting Things Done (GTD)", duration: "2:45", type: "video", isPreview: false },
        { id: 10, title: "Eisenhower Matrix Deep Dive", duration: "2:30", type: "video", isPreview: false },
        { id: 11, title: "Time Blocking Strategies", duration: "2:18", type: "video", isPreview: false },
        { id: 12, title: "Practice Session", duration: "1:15", type: "quiz", isPreview: false }
      ]
    }
  ],
  prerequisites: [
    "Covering all fundamental topics with practical applications",
    "Learn from industry professionals with years of experience",
    "Access to a peer network and instructor feedback for enhanced learning"
  ],
  faqs: [
    {
      id: 1,
      question: "How can I locate a tutor who specializes in the particular subject I need help with?",
      answer: "You can use our advanced search filters to find tutors by subject, level, price range, and availability. Our platform also provides detailed tutor profiles with their specializations and teaching experience."
    },
    {
      id: 2,
      question: "How can I update my profile, contact details, or profile picture?",
      answer: "You can update your profile by going to the 'Profile' section in your dashboard. Click on 'Edit Profile' to modify your personal information, contact details, and upload a new profile picture. Changes are saved automatically."
    },
    {
      id: 3,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our encrypted payment system."
    },
    {
      id: 4,
      question: "Can I get a refund if I'm not satisfied with the course?",
      answer: "Yes, we offer a 30-day money-back guarantee for all courses. If you're not satisfied with your purchase, you can request a full refund within 30 days of enrollment."
    }
  ],
  tags: ["productivity", "time-management", "goals", "efficiency"],
  instructor: {
    id: 1,
    name: "Antony Clara",
    avatar: "/media/instructors/antony.jpg",
    isVerified: true,
    activeStudents: 12,
    courses: 4,
    languages: ["Galician Native", "Azerbaijani", "Basque"],
    socialProfiles: [
      { platform: "facebook", url: "https://facebook.com/antonyclara" },
      { platform: "twitter", url: "https://twitter.com/antonyclara" },
      { platform: "linkedin", url: "https://linkedin.com/in/antonyclara" },
      { platform: "instagram", url: "https://instagram.com/antonyclara" },
      { platform: "youtube", url: "https://youtube.com/@antonyclara" }
    ]
  }
}

export const instructorData = courseData.instructor

export const reviewsData: Review[] = [
  {
    id: 1,
    reviewerName: "Sarah Chapman",
    reviewerAvatar: "/media/students/sarah.jpg",
    rating: 5,
    date: "Dec 19, 2024",
    review: "Steven is an outstanding tutor! His expertise and passion for teaching are evident in every session. He breaks down complex topics into understandable segments, making learning enjoyable. My grades have improved significantly since we started with Steven. Highly recommended!"
  },
  {
    id: 2,
    reviewerName: "Michael Rodriguez",
    reviewerAvatar: "/media/students/michael.jpg",
    rating: 5,
    date: "Dec 15, 2024",
    review: "Excellent course! The time management techniques taught here are practical and immediately applicable. I've seen a significant improvement in my productivity since implementing these strategies. The instructor explains everything clearly and provides great examples."
  },
  {
    id: 3,
    reviewerName: "Emily Johnson",
    reviewerAvatar: "/media/students/emily.jpg",
    rating: 4,
    date: "Dec 10, 2024",
    review: "Great course with valuable insights. The content is well-structured and easy to follow. I particularly enjoyed the practical exercises and real-world examples. Would definitely recommend to anyone looking to improve their time management skills."
  }
]

// Additional courses with quizzes
export const additionalCourses: Course[] = [
  {
    id: 2,
    title: "React Development Masterclass",
    tagline: "Build Modern Web Applications with React and TypeScript",
    rating: 4.8,
    reviews: 124,
    lastUpdated: "Dec 20, 2024",
    language: "English",
    enrolledStudents: 89,
    totalViews: 5420,
    videoThumbnail: "/media/courses/react-course.jpg",
    videoDuration: "45 mins: 30 sec",
    price: 199.00,
    originalPrice: 299.00,
    discount: 33,
    description: "Master React development from fundamentals to advanced concepts. Learn hooks, state management, routing, and best practices for building scalable applications.",
    outcomes: [
      "Build modern React applications",
      "Master React Hooks and Context API",
      "Implement state management with Redux",
      "Create reusable components",
      "Handle routing and navigation",
      "Write clean, maintainable code"
    ],
    curriculum: [
      {
        id: 1,
        title: "React Fundamentals",
        lectures: 4,
        duration: "15 min: 20 sec",
        lessons: [
          {
            id: 1,
            title: "Introduction to React",
            duration: "4:30",
            type: "video",
            isPreview: true,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            description: "Understanding what React is and why it's popular",
            quiz: {
              id: "react-quiz-1",
              title: "React Basics Quiz",
              description: "Test your understanding of React fundamentals",
              questions: [
                {
                  id: "rq1",
                  quizId: "react-quiz-1",
                  questionText: "What is React?",
                  questionType: "multiple_choice",
                  points: 10,
                  options: [
                    { id: "a", text: "A database management system", isCorrect: false, order: 1 },
                    { id: "b", text: "A JavaScript library for building user interfaces", isCorrect: true, order: 2 },
                    { id: "c", text: "A server-side framework", isCorrect: false, order: 3 },
                    { id: "d", text: "A programming language", isCorrect: false, order: 4 }
                  ],
                  correctAnswer: "b",
                  explanation: "React is a JavaScript library for building user interfaces, particularly web applications.",
                  order: 1
                },
                {
                  id: "rq2",
                  quizId: "react-quiz-1",
                  questionText: "React uses a virtual DOM for better performance.",
                  questionType: "true_false",
                  points: 8,
                  correctAnswer: "true",
                  explanation: "Yes, React uses a virtual DOM to optimize rendering and improve performance.",
                  order: 2
                }
              ],
              passingScore: 70,
              maxAttempts: 3,
              timeLimit: 5,
              isRequired: true,
              isActive: true
            }
          },
          {
            id: 2,
            title: "Components and JSX",
            duration: "5:15",
            type: "video",
            isPreview: false,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            description: "Learn about React components and JSX syntax",
            quiz: {
              id: "react-quiz-2",
              title: "Components and JSX Quiz",
              description: "Test your knowledge of React components and JSX",
              questions: [
                {
                  id: "rq3",
                  quizId: "react-quiz-2",
                  questionText: "What is JSX?",
                  questionType: "multiple_choice",
                  points: 12,
                  options: [
                    { id: "a", text: "A new programming language", isCorrect: false, order: 1 },
                    { id: "b", text: "A syntax extension for JavaScript", isCorrect: true, order: 2 },
                    { id: "c", text: "A CSS framework", isCorrect: false, order: 3 },
                    { id: "d", text: "A database query language", isCorrect: false, order: 4 }
                  ],
                  correctAnswer: "b",
                  explanation: "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files.",
                  order: 1
                },
                {
                  id: "rq4",
                  quizId: "react-quiz-2",
                  questionText: "React components must always return JSX.",
                  questionType: "true_false",
                  points: 10,
                  correctAnswer: "false",
                  explanation: "React components can return JSX, but they can also return null or other valid React elements.",
                  order: 2
                }
              ],
              passingScore: 75,
              maxAttempts: 2,
              timeLimit: 6,
              isRequired: true,
              isActive: true
            }
          }
        ]
      }
    ],
    prerequisites: ["Basic JavaScript knowledge", "HTML/CSS fundamentals"],
    faqs: [
      {
        id: 1,
        question: "Do I need to know JavaScript before learning React?",
        answer: "Yes, a solid understanding of JavaScript is essential for React development."
      }
    ],
    tags: ["react", "javascript", "frontend", "web-development"],
    instructor: {
      id: 2,
      name: "Alex Chen",
      avatar: "/media/instructors/alex.jpg",
      isVerified: true,
      activeStudents: 45,
      courses: 8,
      languages: ["English", "Chinese"],
      socialProfiles: [
        { platform: "github", url: "https://github.com/alexchen" },
        { platform: "twitter", url: "https://twitter.com/alexchen" }
      ]
    }
  },
  {
    id: 3,
    title: "Python Data Science Bootcamp",
    tagline: "Master Data Analysis and Machine Learning with Python",
    rating: 4.9,
    reviews: 89,
    lastUpdated: "Dec 18, 2024",
    language: "English",
    enrolledStudents: 156,
    totalViews: 6780,
    videoThumbnail: "/media/courses/python-datascience.jpg",
    videoDuration: "38 mins: 45 sec",
    price: 249.00,
    originalPrice: 399.00,
    discount: 38,
    description: "Complete data science course covering Python, pandas, NumPy, matplotlib, and machine learning algorithms.",
    outcomes: [
      "Master Python for data analysis",
      "Work with pandas and NumPy",
      "Create data visualizations",
      "Build machine learning models",
      "Handle real-world datasets",
      "Present data insights effectively"
    ],
    curriculum: [
      {
        id: 1,
        title: "Python Basics for Data Science",
        lectures: 3,
        duration: "12 min: 30 sec",
        lessons: [
          {
            id: 1,
            title: "Python Data Types",
            duration: "4:20",
            type: "video",
            isPreview: true,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            description: "Understanding Python data types for data science",
            quiz: {
              id: "python-quiz-1",
              title: "Python Data Types Quiz",
              description: "Test your knowledge of Python data types",
              questions: [
                {
                  id: "pq1",
                  quizId: "python-quiz-1",
                  questionText: "Which data type is mutable in Python?",
                  questionType: "multiple_choice",
                  points: 10,
                  options: [
                    { id: "a", text: "String", isCorrect: false, order: 1 },
                    { id: "b", text: "List", isCorrect: true, order: 2 },
                    { id: "c", text: "Tuple", isCorrect: false, order: 3 },
                    { id: "d", text: "Integer", isCorrect: false, order: 4 }
                  ],
                  correctAnswer: "b",
                  explanation: "Lists are mutable in Python, meaning you can modify them after creation.",
                  order: 1
                },
                {
                  id: "pq2",
                  quizId: "python-quiz-1",
                  questionText: "NumPy arrays are more efficient than Python lists for numerical computations.",
                  questionType: "true_false",
                  points: 8,
                  correctAnswer: "true",
                  explanation: "Yes, NumPy arrays are optimized for numerical operations and are much faster than Python lists.",
                  order: 2
                }
              ],
              passingScore: 70,
              maxAttempts: 3,
              timeLimit: 5,
              isRequired: true,
              isActive: true
            }
          }
        ]
      }
    ],
    prerequisites: ["Basic programming knowledge", "High school mathematics"],
    faqs: [
      {
        id: 1,
        question: "Do I need prior experience with data science?",
        answer: "No, this course starts from the basics and builds up to advanced concepts."
      }
    ],
    tags: ["python", "data-science", "machine-learning", "analytics"],
    instructor: {
      id: 3,
      name: "Dr. Maria Rodriguez",
      avatar: "/media/instructors/maria.jpg",
      isVerified: true,
      activeStudents: 78,
      courses: 12,
      languages: ["English", "Spanish"],
      socialProfiles: [
        { platform: "linkedin", url: "https://linkedin.com/in/mariarodriguez" },
        { platform: "twitter", url: "https://twitter.com/mariarodriguez" }
      ]
    }
  }
]
