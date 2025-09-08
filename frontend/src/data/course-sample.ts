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
        { id: 1, title: "Welcome to the Course", duration: "0:45", type: "video", isPreview: true },
        { id: 2, title: "What is Time Management?", duration: "0:32", type: "video", isPreview: false },
        { id: 3, title: "Course Overview PDF", duration: "2 min", type: "pdf", isPreview: false }
      ]
    },
    {
      id: 2,
      title: "Fundamental Principles",
      lectures: 4,
      duration: "8 min: 12 sec",
      lessons: [
        { id: 4, title: "The Time Management Matrix", duration: "2:15", type: "video", isPreview: false },
        { id: 5, title: "Setting SMART Goals", duration: "2:30", type: "video", isPreview: false },
        { id: 6, title: "Priority vs Urgency", duration: "2:12", type: "video", isPreview: false },
        { id: 7, title: "Exercise: Goal Setting", duration: "1:15", type: "quiz", isPreview: false }
      ]
    },
    {
      id: 3,
      title: "Advanced Techniques",
      lectures: 5,
      duration: "12 min: 8 sec",
      lessons: [
        { id: 8, title: "The Pomodoro Technique", duration: "3:20", type: "video", isPreview: false },
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
