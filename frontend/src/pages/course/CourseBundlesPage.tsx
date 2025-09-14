import React, { useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import CourseBundleSlider from '../../components/course/CourseBundleSlider'

interface CourseBundleProps {
  id: string
  title: string
  description: string
  instructor: {
    name: string
    avatar: string
  }
  courseCount: number
  price: number
  originalPrice?: number
  duration: string
  thumbnail: string
  discount?: string
  badgeText?: string
}

const CourseBundlesPage: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [priceFilter, setPriceFilter] = useState('Price')

  const courseBundles: CourseBundleProps[] = [
    {
      id: '1',
      title: 'Cybersecurity & Ethical Hacking',
      description: 'Protect systems and understand ethical hacking principles',
      instructor: {
        name: 'Anthony S',
        avatar: '/api/placeholder/32/32'
      },
      courseCount: 4,
      price: 127.00,
      duration: '38 mins • 45 sec',
      thumbnail: '/api/placeholder/300/200',
      badgeText: 'TOP 10 FREE AI COURSES'
    },
    {
      id: '2', 
      title: 'Digital Marketing & SEO',
      description: 'Boost online presence and grow businesses with digital marketing strategies',
      instructor: {
        name: 'Anthony S',
        avatar: '/api/placeholder/32/32'
      },
      courseCount: 5,
      price: 137.36,
      originalPrice: 146.99,
      duration: '46 mins • 55 sec',
      thumbnail: '/api/placeholder/300/200',
      discount: '28% OFF',
      badgeText: 'THE WORST PROPOSAL EVER'
    },
    {
      id: '3',
      title: 'Learn Spanish for Beginners', 
      description: 'Learn Spanish language for beginners',
      instructor: {
        name: 'Anthony S',
        avatar: '/api/placeholder/32/32'
      },
      courseCount: 3,
      price: 167.00,
      duration: '27 mins • 18 sec',
      thumbnail: '/api/placeholder/300/200',
      badgeText: 'WEBINAR'
    },
    {
      id: '4',
      title: 'Web Development Mastery',
      description: 'Learn the latest web development technologies and build real-world projects',
      instructor: {
        name: 'Anthony S',
        avatar: '/api/placeholder/32/32'
      },
      courseCount: 5,
      price: 144.00,
      originalPrice: 180.00,
      duration: '1 hr • 2 mins • 41 sec',
      thumbnail: '/api/placeholder/300/200',
      discount: '20% OFF',
      badgeText: 'ULTIMATE COURSE BUNDLE'
    },
    {
      id: '5',
      title: 'Data Science & Machine Learning',
      description: 'Master data analysis and machine learning algorithms',
      instructor: {
        name: 'Sarah Johnson',
        avatar: '/api/placeholder/32/32'
      },
      courseCount: 6,
      price: 199.00,
      originalPrice: 249.00,
      duration: '2 hrs • 15 mins',
      thumbnail: '/api/placeholder/300/200',
      discount: '20% OFF',
      badgeText: 'DATA SCIENCE BOOTCAMP'
    },
    {
      id: '6',
      title: 'Mobile App Development',
      description: 'Build iOS and Android apps with React Native',
      instructor: {
        name: 'Mike Chen',
        avatar: '/api/placeholder/32/32'
      },
      courseCount: 4,
      price: 159.00,
      duration: '1 hr • 45 mins',
      thumbnail: '/api/placeholder/300/200',
      badgeText: 'MOBILE MASTERY'
    }
  ]

  const handleSearch = () => {
    console.log('Searching for:', searchKeyword, 'Price filter:', priceFilter)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-purple-50 to-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <span>Home</span>
            <span>/</span>
            <span className="text-gray-900">Course Bundle</span>
          </div>

          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Exclusive Course Bundles
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Enhance student engagement by packaging multiple courses into a single, compelling bundle
            </p>
          </div>

          {/* Search Section */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by keywords"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 placeholder-gray-500"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            <div className="relative">
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white cursor-pointer min-w-[120px] text-gray-900"
              >
                <option>Price</option>
                <option>Low to High</option>
                <option>High to Low</option>
                <option>Under $100</option>
                <option>$100 - $200</option>
                <option>Over $200</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            <button
              onClick={handleSearch}
              className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Course Bundles Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Course Bundles</h2>
        
        {/* Slider Container */}
        <CourseBundleSlider bundles={courseBundles} />
      </div>
    </div>
  )
}

export default CourseBundlesPage
