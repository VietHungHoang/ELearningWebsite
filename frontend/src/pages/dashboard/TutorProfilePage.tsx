import { useState } from 'react'
import { 
  Star, 
  Calendar, 
  MessageCircle, 
  Heart, 
  Clock, 
  Users, 
  BookOpen, 
  CheckCircle, 
  Play,
  ChevronLeft,
  ChevronRight,
  Globe,
  Settings,
  Edit3,
  MessageSquare,
  Award,
  GraduationCap,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube
} from 'lucide-react'

interface Language {
  name: string
  isNative: boolean
}

interface Tutor {
  id: number
  name: string
  isVerified: boolean
  countries: string[]
  tagline: string
  pricePerSession: number
  rating: number
  reviews: number
  bookedSessions: number
  totalSessions: number
  responseTime: string
  socialProfiles: { platform: string; url: string }[]
  subjects: string[]
  languages: Language[]
  achievements: { icon: string; color: string }[]
  videoThumbnail: string
  about: string
  education: EducationItem[]
  experience: ExperienceItem[]
  certifications: CertificationItem[]
  reviewList: Review[]
}

interface EducationItem {
  degree: string
  institution: string
  years: string
  location: string
  description: string
}

interface ExperienceItem {
  title: string
  company: string
  years: string
  location: string
  description: string
}

interface CertificationItem {
  title: string
  issuer: string
  year: string
  description: string
}

interface Review {
  id: number
  reviewerName: string
  reviewerAvatar: string
  country: string
  rating: number
  date: string
  review: string
}

interface SimilarTutor {
  id: number
  name: string
  isVerified: boolean
  pricePerSession: number
  rating: number
  reviews: number
  activeStudents: number
  totalSessions: number
  languages: Language[]
  avatar: string
}

const TutorProfilePage = () => {
  const [activeTab, setActiveTab] = useState('introduction')
  const [activeResumeTab, setActiveResumeTab] = useState('education')
  const [showMoreAbout, setShowMoreAbout] = useState(false)
  const [selectedDate, setSelectedDate] = useState('today')
  const [timeZone, setTimeZone] = useState('Australia/Melbourne')

  // Mock data
  const tutor: Tutor = {
    id: 1,
    name: "Antony Clara",
    isVerified: true,
    countries: ["US", "IT"],
    tagline: "Unlocking Potential Through Customized Academic Guidance.",
    pricePerSession: 20.00,
    rating: 5.0,
    reviews: 2,
    bookedSessions: 18,
    totalSessions: 9,
    responseTime: "3 Hours",
    socialProfiles: [
      { platform: "facebook", url: "https://facebook.com/antonyclara" },
      { platform: "twitter", url: "https://twitter.com/antonyclara" },
      { platform: "instagram", url: "https://instagram.com/antonyclara" },
      { platform: "linkedin", url: "https://linkedin.com/in/antonyclara" },
      { platform: "youtube", url: "https://youtube.com/@antonyclara" }
    ],
    subjects: ["Web Development", "Web Designing", "JavaScript", "React", "Node.js", "Python", "Data Science"],
    languages: [
      { name: "Galician", isNative: true },
      { name: "Azerbaijani", isNative: false },
      { name: "Basque", isNative: false }
    ],
    achievements: [
      { icon: "star", color: "pink" },
      { icon: "graduation", color: "purple" }
    ],
    videoThumbnail: "/media/instructors/antony-video.jpg",
    about: "Hello! My name is Antony Clara, and I'm a passionate tutor dedicated to helping students unlock their full academic potential. With a strong focus on creating personalized learning experiences, I aim to meet each student's unique needs and learning style. I have a diverse background in tutoring, covering subjects such as math, science, and English, and I strive to make every session engaging and effective. I believe that education is more than just memorizing facts; it's about understanding concepts, developing critical thinking skills, and fostering a love for learning that will last a lifetime. My approach combines traditional teaching methods with modern technology to create an interactive and dynamic learning environment.",
    education: [
      {
        degree: "Bachelor of Computer Science",
        institution: "ABC University",
        years: "2015-2019",
        location: "Annaba, American Samoa",
        description: "Focused on software development and cybersecurity, I specialize in creating innovative software solutions that address real-world problems. My coursework included advanced programming languages, database management, and network security protocols."
      },
      {
        degree: "Diploma in Digital Marketing",
        institution: "Marketing Academy",
        years: "2018-2018",
        location: "Berlin, Angola",
        description: "Covered SEO, SEM, and content marketing strategies, I enhance online visibility, drive targeted traffic, and optimize conversion rates for businesses across various industries."
      },
      {
        degree: "Master of Information Technology",
        institution: "XYZ Institute",
        years: "2020-2022",
        location: "Canillo, Andorra",
        description: "Specialized in advanced IT management and data analysis, I excel in enhancing IT infrastructure, implementing security protocols, and leveraging data insights for strategic decision-making."
      },
      {
        degree: "Certification in Cybersecurity",
        institution: "Cyber Defense Center",
        years: "2023-2023",
        location: "Tokyo, Anguilla",
        description: "Focused on network security, threat analysis, and incident response, I protect systems from cyber threats and implement robust security measures for organizations."
      }
    ],
    experience: [
      {
        title: "Senior Web Developer",
        company: "Tech Solutions Inc.",
        years: "2020-2023",
        location: "San Francisco, CA",
        description: "Led development of scalable web applications using React, Node.js, and cloud technologies. Mentored junior developers and implemented best practices for code quality and performance optimization."
      },
      {
        title: "Full Stack Developer",
        company: "Digital Innovations",
        years: "2019-2020",
        location: "New York, NY",
        description: "Developed and maintained web applications, collaborated with cross-functional teams, and contributed to the design and implementation of new features and functionalities."
      }
    ],
    certifications: [
      {
        title: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        year: "2023",
        description: "Demonstrates expertise in designing distributed systems on AWS platform, including compute, storage, networking, and security services."
      },
      {
        title: "Google Analytics Certified",
        issuer: "Google",
        year: "2022",
        description: "Validates proficiency in Google Analytics implementation, data analysis, and reporting for digital marketing and business intelligence."
      }
    ],
    reviewList: [
      {
        id: 1,
        reviewerName: "Judy D",
        reviewerAvatar: "/media/students/judy.jpg",
        country: "US",
        rating: 5.0,
        date: "Aug 29, 2024",
        review: "Antony Clara is an exceptional Physical Education tutor who excels in making fitness engaging and effective. His sessions are personalized to fit each student's needs, helping them achieve their health and wellness goals. His positive attitude and professional approach make every session enjoyable and productive."
      },
      {
        id: 2,
        reviewerName: "Judy D",
        reviewerAvatar: "/media/students/judy.jpg",
        country: "US",
        rating: 5.0,
        date: "Aug 29, 2024",
        review: "Antony Clara is an exceptional Science tutor who makes complex concepts easy to grasp. His lessons are engaging and tailored to each student's needs, fostering a deep understanding of scientific principles. His patience and expertise create an excellent learning environment."
      }
    ]
  }

  const similarTutors: SimilarTutor[] = [
    {
      id: 1,
      name: "Steven Ford",
      isVerified: true,
      pricePerSession: 20.00,
      rating: 4.2,
      reviews: 142,
      activeStudents: 2,
      totalSessions: 2205,
      languages: [
        { name: "English", isNative: true },
        { name: "Afrikaans", isNative: false },
        { name: "Albanian", isNative: false },
        { name: "Amharic", isNative: false }
      ],
      avatar: "/media/instructors/steven.jpg"
    },
    {
      id: 2,
      name: "Anthony Shao",
      isVerified: false,
      pricePerSession: 40.00,
      rating: 4.5,
      reviews: 4,
      activeStudents: 4,
      totalSessions: 2213,
      languages: [
        { name: "Albanian", isNative: true },
        { name: "Arabic", isNative: false },
        { name: "Aragonese", isNative: false }
      ],
      avatar: "/media/instructors/anthony-shao.jpg"
    },
    {
      id: 3,
      name: "Arianne Kearns",
      isVerified: true,
      pricePerSession: 40.00,
      rating: 4.0,
      reviews: 1,
      activeStudents: 1,
      totalSessions: 2204,
      languages: [
        { name: "French", isNative: true },
        { name: "Armenian", isNative: false },
        { name: "Asturian", isNative: false }
      ],
      avatar: "/media/instructors/arianne.jpg"
    },
    {
      id: 4,
      name: "Beau Simard",
      isVerified: true,
      pricePerSession: 20.00,
      rating: 4.0,
      reviews: 1,
      activeStudents: 1,
      totalSessions: 1469,
      languages: [
        { name: "Faroese", isNative: true },
        { name: "Albanian", isNative: false },
        { name: "Belarusian", isNative: false }
      ],
      avatar: "/media/instructors/beau.jpg"
    }
  ]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  const renderSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="w-4 h-4" />
      case 'twitter':
        return <Twitter className="w-4 h-4" />
      case 'instagram':
        return <Instagram className="w-4 h-4" />
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />
      case 'youtube':
        return <Youtube className="w-4 h-4" />
      default:
        return <span className="text-xs font-bold">{platform.charAt(0).toUpperCase()}</span>
    }
  }

  const getDays = () => {
    const days = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      days.push({
        date: date.getDate(),
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        isToday: i === 0
      })
    }
    return days
  }

  const getRatingBreakdown = () => {
    const breakdown = { 5: 2, 4: 0, 3: 0, 2: 0, 1: 0 }
    return breakdown
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tutor Detail Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Side - Tutor Info */}
            <div className="flex-1 space-y-6">
              {/* Profile Picture & Name */}
              <div className="flex items-start gap-4">
                <img
                  src="/media/instructors/antony.jpg"
                  alt={tutor.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{tutor.name}</h1>
                    {tutor.isVerified && (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                    <div className="flex gap-1">
                      {tutor.countries.map((country, index) => (
                        <div key={index} className="w-6 h-4 bg-gray-200 rounded text-xs flex items-center justify-center">
                          {country}
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-lg mb-3">{tutor.tagline}</p>
                  
                  {/* Pricing */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">${tutor.pricePerSession.toFixed(2)}</span>
                    <span className="text-lg text-gray-500">/session</span>
                    <span className="text-sm text-gray-500 ml-2">Starting from</span>
                  </div>
                </div>
              </div>

              {/* Key Info Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <div>
                    <div className="text-lg font-bold text-gray-900">{tutor.rating}</div>
                    <div className="text-sm text-gray-500">({tutor.reviews} reviews)</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-lg font-bold text-gray-900">{tutor.bookedSessions}</div>
                    <div className="text-sm text-gray-500">Booked sessions</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-lg font-bold text-gray-900">{tutor.totalSessions}</div>
                    <div className="text-sm text-gray-500">Sessions</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-lg font-bold text-gray-900">{tutor.responseTime}</div>
                    <div className="text-sm text-gray-500">Response time</div>
                  </div>
                </div>
              </div>

              {/* Social Profiles */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Follow me:</span>
                <div className="flex gap-3">
                  {tutor.socialProfiles.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 cursor-pointer transition-colors"
                      title={`Follow on ${social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}`}
                    >
                      {renderSocialIcon(social.platform)}
                    </a>
                  ))}
                </div>
              </div>

              {/* Teaching Info */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">I can teach</div>
                    <div className="flex flex-wrap gap-2">
                      {tutor.subjects.slice(0, 4).map((subject, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                          {subject}
                        </span>
                      ))}
                      {tutor.subjects.length > 4 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                          +{tutor.subjects.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">I can speak</div>
                    <div className="flex flex-wrap gap-2">
                      {tutor.languages.map((language, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {language.name}
                          {language.isNative && (
                            <span className="ml-1 text-xs font-bold">(Native)</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Achievements</div>
                    <div className="flex gap-2">
                      {tutor.achievements.map((achievement, index) => (
                        <div key={index} className={`w-8 h-8 rounded-full bg-${achievement.color}-100 flex items-center justify-center`}>
                          {achievement.icon === 'star' ? (
                            <Star className="w-4 h-4 text-pink-500" />
                          ) : (
                            <GraduationCap className="w-4 h-4 text-purple-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
                  <Calendar className="w-5 h-5" />
                  Book a session
                </button>
                <button className="flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  Send message
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Right Side - Video Section */}
            <div className="lg:w-96">
              <div className="relative">
                <img
                  src={tutor.videoThumbnail}
                  alt={`${tutor.name} introduction video`}
                  className="w-full h-64 lg:h-80 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-lg">
                  <div className="bg-white bg-opacity-90 rounded-full p-4 hover:bg-opacity-100 transition-all cursor-pointer">
                    <Play className="w-8 h-8 text-gray-800" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'introduction', label: 'Introduction' },
                { id: 'availability', label: 'Availability' },
                { id: 'resume', label: 'Resume Highlights' },
                { id: 'reviews', label: `Reviews (${tutor.reviews})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
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

          <div className="p-6">
            {/* Introduction Tab */}
            {activeTab === 'introduction' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">About me</h3>
                <p className="text-gray-700 leading-relaxed">
                  {showMoreAbout ? tutor.about : tutor.about.substring(0, 200) + '...'}
                </p>
                <button
                  onClick={() => setShowMoreAbout(!showMoreAbout)}
                  className="text-green-600 hover:text-green-700 font-medium mt-2"
                >
                  {showMoreAbout ? 'Show less' : 'Show more'}
                </button>
              </div>
            )}

            {/* Availability Tab */}
            {activeTab === 'availability' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Book a session</h3>
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Today</span>
                        <span className="text-gray-500">September 07 - September 13 2025</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded">
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {getDays().map((day, index) => (
                        <div key={index} className="text-center">
                          <div className="text-sm font-medium text-gray-900">{day.date} {day.month}</div>
                          <div className="text-xs text-gray-500 mb-2">{day.day}</div>
                          <div className="bg-gray-100 text-gray-500 text-xs py-2 px-1 rounded">
                            No sessions
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="lg:w-80">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                        <div className="relative">
                          <select
                            value={timeZone}
                            onChange={(e) => setTimeZone(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          >
                            <option value="Australia/Melbourne">Australia/Melbourne</option>
                            <option value="America/New_York">America/New_York</option>
                            <option value="Europe/London">Europe/London</option>
                          </select>
                          <div className="absolute left-3 top-2.5 flex gap-1">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <Settings className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                      <button className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors">
                        Request a Session
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Resume Highlights Tab */}
            {activeTab === 'resume' && (
              <div>
                <div className="flex space-x-6 mb-6">
                  {[
                    { id: 'education', label: 'Education' },
                    { id: 'experience', label: 'Experience' },
                    { id: 'certifications', label: 'Certification & Awards' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveResumeTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeResumeTab === tab.id
                          ? 'border-green-500 text-green-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-6">
                  {activeResumeTab === 'education' && tutor.education.map((edu, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                        <span className="text-sm text-gray-500">{edu.years}</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">{edu.institution}</div>
                      <div className="text-sm text-gray-500 mb-2">{edu.location}</div>
                      <p className="text-gray-700 text-sm">
                        {edu.description.substring(0, 150)}...
                        <button className="text-green-600 hover:text-green-700 font-medium ml-1">
                          Show more
                        </button>
                      </p>
                    </div>
                  ))}

                  {activeResumeTab === 'experience' && tutor.experience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                        <span className="text-sm text-gray-500">{exp.years}</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">{exp.company}</div>
                      <div className="text-sm text-gray-500 mb-2">{exp.location}</div>
                      <p className="text-gray-700 text-sm">
                        {exp.description.substring(0, 150)}...
                        <button className="text-green-600 hover:text-green-700 font-medium ml-1">
                          Show more
                        </button>
                      </p>
                    </div>
                  ))}

                  {activeResumeTab === 'certifications' && tutor.certifications.map((cert, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{cert.title}</h4>
                        <span className="text-sm text-gray-500">{cert.year}</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">{cert.issuer}</div>
                      <p className="text-gray-700 text-sm">
                        {cert.description.substring(0, 150)}...
                        <button className="text-green-600 hover:text-green-700 font-medium ml-1">
                          Show more
                        </button>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Student Reviews</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Rating Summary */}
                  <div className="lg:col-span-1">
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-gray-900 mb-2">{tutor.rating}</div>
                      <div className="flex justify-center mb-2">
                        {renderStars(tutor.rating)}
                      </div>
                      <div className="text-sm text-gray-600">Based on {tutor.reviews} ratings</div>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(getRatingBreakdown()).map(([rating, count]) => (
                        <div key={rating} className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 w-6">{rating}.0</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: count > 0 ? '100%' : '0%' }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-4">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Review Cards */}
                  <div className="lg:col-span-2 space-y-4">
                    {tutor.reviewList.map((review) => (
                      <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={review.reviewerAvatar}
                            alt={review.reviewerName}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{review.reviewerName}</span>
                              <div className="w-4 h-3 bg-red-500 rounded text-xs flex items-center justify-center text-white">
                                {review.country}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {renderStars(review.rating)}
                              </div>
                              <span className="text-sm text-gray-600">{review.rating}/5.0</span>
                              <span className="text-sm text-gray-500">• {review.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm">
                          {review.review.substring(0, 200)}...
                          <button className="text-green-600 hover:text-green-700 font-medium ml-1">
                            Show more
                          </button>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar Tutors Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Similar Tutors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {similarTutors.map((tutor) => (
              <div key={tutor.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow relative">
                {/* Header Section */}
                <div className="flex items-start gap-3 mb-4">
                  <img
                    src={tutor.avatar}
                    alt={tutor.name}
                    className="w-12 h-12 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900 truncate">{tutor.name}</span>
                      {tutor.isVerified ? (
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-3 bg-red-500 rounded text-xs flex items-center justify-center text-white flex-shrink-0">
                          !
                        </div>
                      )}
                      <div className="w-6 h-4 bg-gray-200 rounded text-xs flex items-center justify-center flex-shrink-0">
                        US
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">Prepare for beta testing.</p>
                  </div>
                </div>

                {/* Pricing */}
                <div className="mb-4">
                  <div className="text-2xl font-bold text-gray-900">${tutor.pricePerSession.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">/session</div>
                </div>

                {/* Info Section */}
                <div className="space-y-3 mb-6">
                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900">{tutor.rating} / 5.0</span>
                    <span className="text-sm text-gray-500">({tutor.reviews} reviews)</span>
                  </div>

                  {/* Active Students */}
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{tutor.activeStudents} Active students</span>
                  </div>

                  {/* Sessions */}
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{tutor.totalSessions} Sessions</span>
                  </div>

                  {/* Languages */}
                  <div className="flex items-start gap-2">
                    <Globe className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">
                      {tutor.languages.slice(0, 2).map(lang => lang.name).join(', ')}
                      {tutor.languages.length > 2 && ` +${tutor.languages.length - 2} more`}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                    <Calendar className="w-4 h-4" />
                    Book a session
                  </button>
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-700 py-2 px-4 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      Send message
                    </button>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button className="bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              View All Tutors
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default TutorProfilePage
